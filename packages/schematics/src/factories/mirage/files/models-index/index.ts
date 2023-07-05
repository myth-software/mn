<% for(const title of titles) { %>
  import { <%= camelize(title) %>Model } from './<%= dasherize(title) %>.model';
<% } %>

export const models = {
  <% for(const title of titles) { %>
    <%= camelize(title) %>: <%= camelize(title) %>Model,
  <% } %>
};
