import {
  AdditionalProperties,
  AdditionalPropertyTypes,
  Cache,
  MountNotionQueryParameters,
  ReadonlyColumnTypes,
} from '@mountnotion/types';
import { ensure, getJoinTable } from '@mountnotion/utils';
import { InferInsertModel, eq } from 'drizzle-orm';
import {
  MountNotionClientDrizzleConfig,
  MountNotionDrizzleClient,
} from './configure-drizzle.type';
import { mapNotionToDrizzleWhere } from './notion-to-drizzle-where.mapper';
import removeFalsyValues from './remove-falsy-values';

export function configureDrizzle<
  TConfig extends MountNotionClientDrizzleConfig<TConfig['schema']>
>(config: TConfig): MountNotionDrizzleClient<TConfig> {
  const db = config.db;

  const databases = Object.entries(config.schema).map(
    ([title, database], i) => {
      type Database = typeof database;
      const cache = config.caches[title] as Cache;
      return [
        title,
        {
          query: async (args: MountNotionQueryParameters<any>) => {
            const where = typeof args === 'string' ? JSON.parse(args) : args;
            const { filter, orderBy, limit, offset } = mapNotionToDrizzleWhere(
              database,
              where
            );
            const query = db.select().from(database);

            if (filter) {
              query.where(filter);
            }

            if (orderBy) {
              query.orderBy(...orderBy);
            }

            if (limit) {
              query.limit(limit);
            }

            if (offset) {
              query.offset(offset);
            }

            const response = await query;

            return response;
          },
          retrieve: async ({ id }: Pick<AdditionalProperties, 'id'>) => {
            const [response] = await db
              .select()
              .from(database)
              .where(eq(database.id, id));

            return response;
          },
          update: async ({
            id,
            ...body
          }: Pick<AdditionalProperties, 'id'> &
            Omit<
              InferInsertModel<Database>,
              ReadonlyColumnTypes & AdditionalPropertyTypes
            >) => {
            const clean = removeFalsyValues(body);
            const [response] = await db
              .update(database)
              .set(clean)
              .where(eq(database.id, id))
              .returning();

            return response;
          },
          create: async (
            body: Omit<
              InferInsertModel<Database>,
              ReadonlyColumnTypes & AdditionalPropertyTypes
            >
          ) => {
            const clean = removeFalsyValues(body);
            const [primary] = await db
              .insert(database)
              .values(clean)
              .returning();

            if (!cache.relations) {
              return primary;
            }

            const relations = Object.keys(clean).reduce((acc, key) => {
              if (ensure(cache.relations)[key]) {
                return acc.concat(key);
              }

              return acc;
            }, [] as string[]);

            const joinTables = relations
              .filter((relation) => {
                console.log({ filter: clean[relation] });
                if (typeof clean[relation] === 'string') {
                  return true;
                }
                if (
                  Array.isArray(clean[relation]) &&
                  clean[relation].length !== 0
                ) {
                  return true;
                }

                return false;
              })
              .map((relation) =>
                getJoinTable(relation, cache, {
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
              secondValue,
              first,
              second,
            } of joinTables) {
              const isFirstArray = Array.isArray(firstValue);
              const isSecondArray = Array.isArray(secondValue);

              if (isFirstArray) {
                const values = firstValue
                  .map((val) => ({
                    [firstId]: val,
                    [secondId]: secondValue,
                  }))
                  .map((val) =>
                    db.insert(config.schema[constName]).values(val).returning()
                  );
                const created = (await Promise.all(values)).flat();
                pending[first] = created.map((creation) => creation[firstId]);
              }

              if (isSecondArray) {
                const values = secondValue
                  .map((val) => ({
                    [firstId]: firstValue,
                    [secondId]: val,
                  }))
                  .map((val) =>
                    db.insert(config.schema[constName]).values(val).returning()
                  );
                const created = (await Promise.all(values)).flat();
                pending[second] = created.map((creation) => creation[secondId]);
              }
            }
            return { ...primary, ...pending };
          },
          delete: async ({ id }: Pick<AdditionalProperties, 'id'>) => {
            const [response] = await db
              .delete(database)
              .where(eq(database.id, id))
              .returning();

            return response;
          },
        },
      ];
    }
  );

  return Object.fromEntries(databases);
}
