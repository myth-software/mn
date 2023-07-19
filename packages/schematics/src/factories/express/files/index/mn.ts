<% if (options.debug) { %>
  <%= log.debug({ action: 'debugging', message: 'mn.ts' }) %>
<% } %>

import { configure } from '@mountnotion/sdk';
import { client } from '<%= options.drizzle %>';
import { indicies } from '<%= options.entities %>';

const notion = configure({ indicies });
export const mn =
  process.env.NODE_ENV === 'production'
    ? (client as unknown as typeof notion)
    : notion;

export { client, notion };

<% if (options.debug) { %>
  <%= log.debug({ action: 'debugging', message: 'end mn.ts' }) %>
<% } %>