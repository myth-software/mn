import { Schema } from '@mountnotion/types';
import { getJoinTable, variablize } from '@mountnotion/utils';
import { eq } from 'drizzle-orm';
import { MountNotionClientDrizzleConfig } from './configure-drizzle.type';

export default async function populateRelatedIds<
  TRow extends Record<string, any>,
  TConfig extends MountNotionClientDrizzleConfig<TConfig['schema']>
>(primary: TRow, config: TConfig, title: string) {
  const db = config.db;
  const notionScheme = config.notionSchema[title] as Schema;

  if (!notionScheme.relations) {
    return primary;
  }

  const mapping = Object.keys(notionScheme.relations).reduce(
    (acc, curr) => ({ ...acc, [variablize(curr)]: curr }),
    {} as Record<string, string>
  );
  const relations = Object.keys(primary).reduce((acc, key) => {
    if (mapping[key]) {
      return acc.concat(mapping[key]);
    }

    return acc;
  }, [] as string[]);

  const joinTables = relations.map((relation) =>
    getJoinTable(relation, notionScheme, {
      primaryId: primary['id'],
      relatedIds: [],
    })
  );

  const pending = {} as any;
  for (const {
    constName,
    firstId,
    secondId,
    firstValue,
    first,
    second,
    primaryId,
  } of joinTables) {
    // populate related ids
    const drizzleJoinScheme = config.schema[constName];
    const isPrimaryFirst = firstValue === primaryId;
    const lookupRelation = isPrimaryFirst
      ? drizzleJoinScheme[firstId]
      : drizzleJoinScheme[secondId];
    const lookupId = isPrimaryFirst ? secondId : firstId;
    const lookup = isPrimaryFirst ? second : first;
    const rows = await db
      .select()
      .from(drizzleJoinScheme)
      .where(eq(lookupRelation, primaryId));

    const relatedIds = rows.map((row) => {
      return row[lookupId];
    });

    // update on the join table with the value of relatedIds
    pending[lookup] = relatedIds;
  }

  return { ...primary, ...pending };
}
