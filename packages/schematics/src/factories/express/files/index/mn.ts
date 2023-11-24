<% if (options.debug) { %>
  <% log.debug({ action: 'debugging', message: 'begin: mn.ts' }) %>
<% } %>

import { SCHEMA } from '<%= options.schema %>';
import { db, drizzleClient } from '<%= options.drizzle %>';
import { configureNotion } from '@mountnotion/sdk';

const notionClient = configureNotion({ schema: SCHEMA });
export const mn =
  process.env.NODE_ENV === 'production'
    ? (drizzleClient as unknown as typeof notion)
    : notionClient;

export { db, drizzleClient, notionClient };

<% if (options.debug) { %>
  <% log.debug({ action: 'debugging', message: 'end: mn.ts' }) %>
<% } %>