import { configureDrizzle } from '@mountnotion/sdk';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './drizzle.schema';
export * as schema from './drizzle.schema';

export const db: PostgresJsDatabase = drizzle(
  postgres(process.env['CONNECTION_STRING']!, {
    ssl:
      process.env['NODE_ENV']! === 'production'
        ? { rejectUnauthorized: false }
        : process.env['NODE_ENV']! === 'staging'
        ? true
        : false,
  })
);

export const drizzleClient = configureDrizzle({
  db,
  schema,
});
