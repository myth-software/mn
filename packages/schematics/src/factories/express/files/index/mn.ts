<% if (options.debug) { %>
  <%= logDebug({ action: 'debugging', message: 'mn.ts' }) %>
<% } %>

import { client } from '@pferd/domain-pferd-drizzle';
import { client as notion } from '@pferd/domain-pferd-entities';
export const mn = process.env.NODE_ENV === 'production' ? client : notion;

<% if (options.debug) { %>
  <%= logDebug({ action: 'debugging', message: 'end mn.ts' }) %>
<% } %>