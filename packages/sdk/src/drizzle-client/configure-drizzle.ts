import {
  AdditionalProperties,
  AdditionalPropertyTypes,
  MountNotionQueryParameters,
  ReadonlyColumnTypes,
} from '@mountnotion/types';
import { eq, InferInsertModel } from 'drizzle-orm';
import {
  MountNotionClientDrizzleConfig,
  MountNotionDrizzleClient,
} from './configure-drizzle.type';
import { mapNotionToDrizzleWhere } from './notion-to-drizzle-where.mapper';
import removeFalsyValues from './remove-falsy-values';

export function configureDrizzle<Config extends MountNotionClientDrizzleConfig>(
  config: Config
): MountNotionDrizzleClient<Config> {
  const db = config.db;

  const databases = Object.entries(config.schema).map(([title, database]) => {
    type Database = typeof database;
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
          const response = await db.insert(database).values(clean).returning();
          return response[0];
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
  });

  return Object.fromEntries(databases);
}
