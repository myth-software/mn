<% for(const title of titles) { %>
  export * from './<%= dasherize(title) %>.api';
  import { <%= camelize(title) %>Api } from './<%= dasherize(title) %>.api';
<% } %>

export const apis: {
  [title: string]: any;
} = {
 <% for(const title of titles) { %>
  '<%= title %>': <%= camelize(title) %>Api,
 <% } %>
};
