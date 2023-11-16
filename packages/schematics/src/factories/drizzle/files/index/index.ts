import { configureDrizzle } from '@mountnotion/sdk';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './drizzle.schema';
export * as schema from './drizzle.schema';
export const db = drizzle(
  postgres(process.env['CONNECTION_STRING']!, {
    ssl:
      process.env['NODE_ENV']! === 'production'
        ? { rejectUnauthorized: false }
        : process.env['NODE_ENV']! === 'staging'
        ? true
        : false,
  }),
  { schema }
);
export const drizzleClient = configureDrizzle({ db, schema });
