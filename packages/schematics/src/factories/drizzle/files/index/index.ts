import postgres from 'postgres';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';

import { configureDrizzle } from '@mountnotion/sdk';
<% for(const title of titles) { %>
  export * from  './schema/<%= dasherize(title) %>.drizzle';
<% } %>
<% for(const title of titles) { %>
  import { <%= camelize(title) %> } from  './schema/<%= dasherize(title) %>.drizzle';
<% } %>

<% if(relations) { %>
  import * as relations from  './schema/relations';
<% } %>

export const schema = {
  <% for(const title of titles) { %>
    <%= camelize(title) %>,
  <% } %>
  <% if(relations) { %>
    ...relations
  <% } %>
};

export const db: PostgresJsDatabase = drizzle(postgres(process.env['CONNECTION_STRING']!, { ssl: true }));
export const client = configureDrizzle({
  db,
  indicies: schema,
});