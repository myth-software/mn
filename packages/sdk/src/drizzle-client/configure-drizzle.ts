import {
  AdditionalPropertyTypes,
  MountNotionQueryParameters,
  ReadonlyColumnTypes,
} from '@mountnotion/types';
import { eq, InferModel } from 'drizzle-orm';
import {
  MountNotionClientDrizzleConfig,
  MountNotionDrizzleClient,
} from './configure-drizzle.type';
import { mapNotionToDrizzleWhere } from './notion-to-drizzle-where.mapper';

export function configureDrizzle<Config extends MountNotionClientDrizzleConfig>(
  config: Config
): MountNotionDrizzleClient<Config> {
  const db = config.db;

  const databases = Object.entries(config.indicies).map(([title, database]) => {
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
        retrieve: async ({ id }: { id: string }) => {
          const [response] = await db
            .select()
            .from(database)
            .where(eq(database.id, id));

          return response;
        },
        update: async ({
          id,
          ...body
        }: { id: string } & Omit<
          InferModel<Database, 'insert'>,
          ReadonlyColumnTypes & AdditionalPropertyTypes
        >) => {
          const [response] = await db
            .update(database)
            .set(body)
            .where(eq(database.id, id))
            .returning();

          return response;
        },
        create: async (
          body: Omit<
            InferModel<Database, 'insert'>,
            ReadonlyColumnTypes & AdditionalPropertyTypes
          >
        ) => {
          const response = await db.insert(database).values(body).returning();
          return response[0];
        },
        delete: async ({ id }: { id: string }) => {
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
