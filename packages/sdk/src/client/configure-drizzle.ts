import {
  AdditionalPropertyTypes,
  MountNotionQueryParameters,
  ReadonlyColumnTypes,
} from '@mountnotion/types';
import { eq, InferModel } from 'drizzle-orm';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as postgres from 'postgres';
import { notionToDrizzleWhereMapper } from './notion-to-drizzle-where.mapper';

type MountNotionClientDrizzleConfig = {
  connectionString: string;
  indicies: {
    [key: string]: any;
  };
};

type MountNotionDrizzleClient<T extends MountNotionClientDrizzleConfig> = {
  [Property in keyof T['indicies']]: T['indicies'][Property] extends infer Database extends T['indicies'][Property]
    ? {
        query: (
          query?: MountNotionQueryParameters<any>
        ) => Promise<InferModel<Database>[]>;
        retrieve: (body: { id: string }) => Promise<InferModel<Database>>;
        update: (
          body: {
            id: string;
          } & Omit<
            InferModel<Database, 'insert'>,
            ReadonlyColumnTypes & AdditionalPropertyTypes
          >
        ) => Promise<InferModel<Database>>;
        create: (
          body: Omit<
            InferModel<Database, 'insert'>,
            ReadonlyColumnTypes & AdditionalPropertyTypes
          >
        ) => Promise<InferModel<Database>>;
        delete: (body: { id: string }) => Promise<InferModel<Database>>;
      }
    : never;
};

export function configureDrizzle<Config extends MountNotionClientDrizzleConfig>(
  config: Config
): MountNotionDrizzleClient<Config> {
  const client = postgres(config.connectionString);
  const db: PostgresJsDatabase = drizzle(client);

  const databases = Object.entries(config.indicies).map(([title, database]) => {
    type Database = typeof database;
    return [
      title,
      {
        query: async (args: MountNotionQueryParameters<any>) => {
          const where = notionToDrizzleWhereMapper(database, args);

          const response = await db.select().from(database).where(where);

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
          return await db.insert(database).values(body).returning();
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
