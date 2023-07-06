<% if (options.debug) { %>
  <%= log.debug({ action: 'debugging', message: 'mn.ts' }) %>
<% } %>

import { client } from '<%= options.drizzle %>';
import { client as notion } from '<%= options.entities %>';
export const mn = process.env.NODE_ENV === 'production' ? client : notion;

<% if (options.debug) { %>
  <%= log.debug({ action: 'debugging', message: 'end mn.ts' }) %>
<% } %>