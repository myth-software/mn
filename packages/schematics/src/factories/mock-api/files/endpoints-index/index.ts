<% for(const title of titles) { %>
  import { <%= camelize(title) %>Endpoints } from './<%= dasherize(title) %>.endpoints';
<% } %>

const endpoints = {
  <% for(const title of titles) { %> <%= camelize(title) %>: <%= camelize(title) %>Endpoints, <% } %>
};

export { endpoints };