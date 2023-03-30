<% for(const title of titles) { %>
  import { <%= camelize(title) %> } from  './<%= dasherize(title) %>.<%= language %>.i18n';
<% } %>

export default {
  <% for(const title of titles) { %>
    "<%= title %>":  <%= camelize(title) %>,
  <% } %>
};