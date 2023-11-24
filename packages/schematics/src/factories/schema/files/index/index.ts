<% if (options.debug) { %>
  <% log.debug({ action: 'debugging', message: 'begin: schema/index.ts' }) %>
<% } %>

  export * as schema from './drizzle.schema';
  export * from './notion.schema';
import { configureDrizzle, configureNotion } from '@mountnotion/sdk';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './drizzle.schema';
import { SCHEMA } from './notion.schema';
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

export const drizzleClient = configureDrizzle({ db, schema, schema: SCHEMA });
export const notionClient = configureNotion({
  integrationKey: process.env['INTEGRATION_KEY']!,
  schema: SCHEMA
});

<% if (options.debug) { %>
  <% log.debug({ action: 'debugging', message: 'end schema/index.ts' }) %>
<% } %>