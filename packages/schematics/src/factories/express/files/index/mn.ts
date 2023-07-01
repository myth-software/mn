<% if (options.debug) { %>
  <%= logDebug({ action: 'debugging', message: 'mn.ts' }) %>
<% } %>

import { indicies } from '<%= options.entities %>';
import { indicies as drizzle } from '<%= options.drizzle %>'
import { configure } from '@mountnotion/sdk';


export const mn =
  process.env.NODE_ENV === 'production'
    ? configureDrizzle({
      connectionString: process.env.CONNECTION_STRING,
      indicies: drizzle
    })
    : configure({
        integrationKey: process.env.INTEGRATION_KEY,
        indicies,
      });


<% if (options.debug) { %>
  <%= logDebug({ action: 'debugging', message: 'end mn.ts' }) %>
<% } %>