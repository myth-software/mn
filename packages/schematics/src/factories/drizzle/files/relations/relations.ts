<% for(const title of titles) { %>
  import { <%= camelize(title) %> } from  './schema/<%= dasherize(title) %>.drizzle';
<% } %>

export default {
  <% for(const title of titles) { %>
    <%= camelize(title) %>,
  <% } %>
}