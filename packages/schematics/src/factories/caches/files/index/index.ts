<% if (options.debug) { %>
  <% log.debug({ action: 'debugging', message: 'cache: index.ts' }) %>
<% } %>

import { configureNotion } from '@mountnotion/sdk';
<% for(const title of titles) { %>
  export * from  './<%= dasherize(title) %>.cache';
<% } %>
<% for(const title of titles) { %>
  import { <%= underscore(title).toUpperCase() %> } from  './<%= dasherize(title) %>.cache';
<% } %>

export const caches = {
  <% for(const title of titles) { %>
    <%= camelize(title) %>:  <%= underscore(title).toUpperCase() %>,
  <% } %>
};
export const notionClient = configureNotion({ integrationKey: process.env['INTEGRATION_KEY']!, caches });


<% if (options.debug) { %>
  <% log.debug({ action: 'debugging', message: 'cache: end index.ts' }) %>
<% } %>