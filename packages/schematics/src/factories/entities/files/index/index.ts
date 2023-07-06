<% if (options.debug) { %>
  <%= log.debug({ action: 'debugging', message: 'entity: index.ts' }) %>
<% } %>

import { configure } from '@mountnotion/sdk';
<% for(const title of titles) { %>
  export * from  './<%= dasherize(title) %>.entity';
<% } %>
<% for(const title of titles) { %>
  import { <%= underscore(title).toUpperCase() %> } from  './<%= dasherize(title) %>.entity';
<% } %>

export const indicies = {
  <% for(const title of titles) { %>
    <%= camelize(title) %>:  <%= underscore(title).toUpperCase() %>,
  <% } %>
};
export const client = configure({ integrationKey: process.env['INTEGRATION_KEY']!, indicies });


<% if (options.debug) { %>
  <%= log.debug({ action: 'debugging', message: 'entity: end index.ts' }) %>
<% } %>