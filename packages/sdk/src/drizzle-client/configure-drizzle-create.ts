import {
  AdditionalPropertyTypes,
  ReadonlyColumnTypes,
  Schema,
} from '@mountnotion/types';
import { getJoinTable, variablize } from '@mountnotion/utils';
import { InferInsertModel } from 'drizzle-orm';
import { MountNotionClientDrizzleConfig } from './configure-drizzle.type';
import removeFalsyValues from './remove-falsy-values';

export default function configureDrizzleCreate<
  TConfig extends MountNotionClientDrizzleConfig<TConfig['schema']>
>(config: TConfig, title: string, drizzleScheme: TConfig['schema'][string]) {
  const db = config.db;
  const notionScheme = config.notionSchema[title] as Schema;

  return async function drizzleCreate(
    body: Omit<
      InferInsertModel<typeof drizzleScheme>,
      ReadonlyColumnTypes & AdditionalPropertyTypes
    >
  ) {
    const clean = removeFalsyValues(body) as any;
    const [primary] = await db.insert(drizzleScheme).values(clean).returning();

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

    const joinTables = relations
      .filter((relation) => {
        const value = clean[variablize(relation)];
        if (typeof value === 'string') {
          return true;
        }
        if (Array.isArray(value) && value.length !== 0) {
          return true;
        }

        return false;
      })
      .map((relation) => {
        const value = clean[variablize(relation)];
        return getJoinTable(relation, notionScheme, {
          primaryId: primary.id,
          relatedIds: typeof value === 'string' ? [value] : value,
        });
      });

    const pending = {} as any;
    for (const {
      constName,
      firstId,
      secondId,
      firstValue,
      secondValue,
      relatedColumn,
      primaryId,
    } of joinTables) {
      const isFirstPrimary = primaryId === firstValue;

      const arr = isFirstPrimary ? secondValue : firstValue;
      if (!Array.isArray(arr)) {
        throw new Error('unexpectedly not an array');
      }

      const values = arr
        .map((val) => ({
          [firstId]: isFirstPrimary ? val : secondValue,
          [secondId]: isFirstPrimary ? secondValue : val,
        }))
        .map((val) =>
          db.insert(config.schema[constName]).values(val).returning()
        );
      const created = (await Promise.all(values)).flat();
      pending[variablize(relatedColumn)] = created.map(
        (creation) => creation[isFirstPrimary ? firstId : secondId]
      );
    }
    return { ...primary, ...pending };
  };
}
