<% for(const title of titles) { %>
  import { <%= camelize(title) %> } from  './<%= dasherize(title) %>.drizzle';
<% } %>

export default {
  <% for(const title of titles) { %>
    <%= camelize(title) %>,
  <% } %>
}