<% for(const title of titles) { %>
  export * from  './schema/<%= dasherize(title) %>.drizzle';
<% } %>
<% for(const title of titles) { %>
  import { <%= camelize(title) %> } from  './schema/<%= dasherize(title) %>.drizzle';
<% } %>

export const indicies = {
  <% for(const title of titles) { %>
    <%= camelize(title) %>,
  <% } %>
};