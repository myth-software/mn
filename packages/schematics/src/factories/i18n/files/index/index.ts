<% for(const title of titles) { %>
  import { <%= underscore(title).toUpperCase() %> } from  './<%= dasherize(title) %>.i18n';
<% } %>

export const en = JSON.stringify({
  "entity": {
    <% for(const title of titles) { %>
      <%= camelize(title) %>:  <%= underscore(title).toUpperCase() %>,
    <% } %>
  }
});