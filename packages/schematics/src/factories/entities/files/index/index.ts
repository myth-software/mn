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