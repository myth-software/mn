<% if (options.debug) { %>
  <% log.debug({ action: 'debugging', message: 'mn.ts' }) %>
<% } %>

import { caches } from '<%= options.caches %>';
import { db, drizzleClient } from '<%= options.drizzle %>';
import { configureNotion } from '@mountnotion/sdk';

const notionClient = configureNotion({ caches });
export const mn =
  process.env.NODE_ENV === 'production'
    ? (drizzleClient as unknown as typeof notion)
    : notionClient;

export { db, drizzleClient, notionClient };

<% if (options.debug) { %>
  <% log.debug({ action: 'debugging', message: 'end mn.ts' }) %>
<% } %>