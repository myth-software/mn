import { Schema } from '@mountnotion/types';
import { getJoinTable, variablize } from '@mountnotion/utils';
import { eq, inArray, notInArray } from 'drizzle-orm';
import {
  FilterArgs,
  MountNotionClientDrizzleConfig,
} from '../configure-drizzle.type';
import { existencePropertyFilter } from './existence.filter';

export function relationPropertyFilter<
  TConfig extends MountNotionClientDrizzleConfig<TConfig['schema']>
>(
  { database: drizzleScheme, filter, property }: FilterArgs,
  config: TConfig,
  title: string
) {
  const existence = existencePropertyFilter({
    database: drizzleScheme,
    filter,
    property,
  });

  if (existence) {
    return existence;
  }
  const db = config.db;
  const notionScheme = config.notionSchema[title] as Schema;
  if (!notionScheme.relations) {
    throw new Error('unexpected missing relations');
  }
  const mapping = Object.keys(notionScheme.relations).reduce(
    (acc, curr) => ({ ...acc, [variablize(curr)]: curr }),
    {} as Record<string, string>
  );
  const relation = mapping[property];
  const joinTable = getJoinTable(relation, notionScheme, {
    primaryId: '',
    relatedIds: [''],
  });

  if (filter.contains) {
    const relatedId = filter.contains;
    return inArray(
      drizzleScheme.id,
      db
        .select({
          primaryId:
            config.schema[joinTable.constName][
              joinTable.isRelatedTableFirst
                ? joinTable.secondId
                : joinTable.firstId
            ],
        })
        .from(config.schema[joinTable.constName])
        .where(
          eq(
            config.schema[joinTable.constName][
              joinTable.isRelatedTableFirst
                ? joinTable.firstId
                : joinTable.secondId
            ],
            relatedId
          )
        )
    );
  }

  if (filter.does_not_contain) {
    const relatedId = filter.contains;
    return notInArray(
      drizzleScheme.id,
      db
        .select({
          primaryId:
            config.schema[joinTable.constName][
              joinTable.isRelatedTableFirst
                ? joinTable.secondId
                : joinTable.firstId
            ],
        })
        .from(config.schema[joinTable.constName])
        .where(
          eq(
            config.schema[joinTable.constName][
              joinTable.isRelatedTableFirst
                ? joinTable.firstId
                : joinTable.secondId
            ],
            relatedId
          )
        )
    );
  }

  throw new Error('uncaught relation filter case');
}
