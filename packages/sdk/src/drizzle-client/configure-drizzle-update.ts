import {
  AdditionalProperties,
  AdditionalPropertyTypes,
  ReadonlyColumnTypes,
  Schema,
} from '@mountnotion/types';
import { getJoinTable, variablize } from '@mountnotion/utils';
import { InferInsertModel, eq } from 'drizzle-orm';
import { MountNotionClientDrizzleConfig } from './configure-drizzle.type';
import removeFalsyValues from './remove-falsy-values';

export default function configureDrizzleUpdate<
  TConfig extends MountNotionClientDrizzleConfig<TConfig['schema']>
>(config: TConfig, title: string, drizzleScheme: TConfig['schema'][string]) {
  const db = config.db;
  const notionScheme = config.notionSchema[title] as Schema;

  return async function drizzleUpdate({
    id,
    ...body
  }: Pick<AdditionalProperties, 'id'> &
    Omit<
      InferInsertModel<typeof drizzleScheme>,
      ReadonlyColumnTypes & AdditionalPropertyTypes
    >) {
    // validation
    const clean = removeFalsyValues(body);

    const [primary] = await db
      .update(drizzleScheme)
      .set(clean)
      .where(eq(drizzleScheme['id'], id))
      .returning();

    if (!notionScheme.relations) {
      return primary;
    }

    const mapping = Object.keys(notionScheme.relations).reduce(
      (acc, curr) => ({ ...acc, [variablize(curr)]: curr }),
      {} as Record<string, string>
    );
    const relations = Object.keys(clean).reduce((acc, key) => {
      if (mapping[key]) {
        return acc.concat(mapping[key]);
      }

      return acc;
    }, [] as string[]);

    const joinTables = relations.map((relation) =>
      getJoinTable(relation, notionScheme, {
        primaryId: primary.id,
        relatedIds:
          typeof clean[relation] === 'string'
            ? [clean[relation]]
            : clean[relation],
      })
    );

    const pending = {} as any;
    for (const {
      constName,
      firstId,
      secondId,
      firstValue,
      first,
      primaryId,
      relatedIds,
    } of joinTables) {
      const drizzleJoinScheme = config.schema[constName];
      // delete from the join table the rows that have the primary key
      const isPrimaryFirst = firstValue === primaryId;
      await db
        .delete(drizzleJoinScheme)
        .where(
          eq(drizzleJoinScheme[isPrimaryFirst ? firstId : secondId], primaryId)
        )
        .returning();

      // update on the join table with the value of relatedIds if its not null;
      if (relatedIds) {
        const values = relatedIds.map((relatedId) => {
          const setValues = isPrimaryFirst
            ? {
                [firstId]: primaryId,
                [secondId]: relatedId,
              }
            : {
                [firstId]: relatedId,
                [secondId]: secondId,
              };

          return db.update(config.schema[constName]).set(setValues);
        });

        const updated = (await Promise.all(values)).flat();
        pending[first] = updated.map((creation) => creation[firstId]);
      }
    }

    return { ...primary, ...pending };
  };
}
