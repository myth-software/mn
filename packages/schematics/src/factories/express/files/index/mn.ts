<% if (options.debug) { %>
  <%= logDebug({ action: 'debugging', message: 'mn.ts' }) %>
<% } %>

import { indicies } from '<%= options.entities %>';
import { client } from '<%= options.drizzle %>'
import { configure } from '@mountnotion/sdk';


export const mn =
  process.env.NODE_ENV === 'production'
    ? client
    : configure({
        integrationKey: process.env.INTEGRATION_KEY,
        indicies,
      });


<% if (options.debug) { %>
  <%= logDebug({ action: 'debugging', message: 'end mn.ts' }) %>
<% } %>