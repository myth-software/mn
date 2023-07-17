import {
  AdditionalPropertyTypes,
  MountNotionQueryParameters,
  ReadonlyColumnTypes,
} from '@mountnotion/types';
import { eq, InferModel } from 'drizzle-orm';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as postgres from 'postgres';
import {
  MountNotionClientDrizzleConfig,
  MountNotionDrizzleClient,
} from './configure-drizzle.type';
import { mapNotionToDrizzleWhere } from './notion-to-drizzle-where.mapper';

export function configureDrizzle<Config extends MountNotionClientDrizzleConfig>(
  config: Config
): MountNotionDrizzleClient<Config> {
  const client = postgres(config.connectionString, { ssl: true });
  const db: PostgresJsDatabase = drizzle(client);

  const databases = Object.entries(config.indicies).map(([title, database]) => {
    type Database = typeof database;
    return [
      title,
      {
        query: async (args: MountNotionQueryParameters<any>) => {
          const where = typeof args === 'string' ? JSON.parse(args) : args;
          const { filter, orderBy } = mapNotionToDrizzleWhere(database, where);

          if (filter && orderBy) {
            const response = await db
              .select()
              .from(database)
              .where(filter)
              .orderBy(...orderBy);

            return response;
          }
          if (filter) {
            const response = await db.select().from(database).where(filter);

            return response;
          }

          if (orderBy) {
            const response = await db
              .select()
              .from(database)
              .orderBy(...orderBy);

            return response;
          }

          const response = await db.select().from(database);

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
