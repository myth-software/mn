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

export const indicies = {
  <% for(const title of titles) { %>
    <%= camelize(title) %>,
  <% } %>
  <% if(relations) { %>
    ...relations
  <% } %>
};

export const client = configureDrizzle({
  connectionString: process.env['CONNECTION_STRING']!,
  indicies,
});