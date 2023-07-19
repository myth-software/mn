<% if (options.debug) { %>
  <%= log.debug({ action: 'debugging', message: 'locals index-for-entity' }) %>
  <%= log.debug({ action: 'debugging', message: `databaseName is ${databaseName}` }) %>
<% } %>


import { <%= classify(databaseName) %> } from '<%= entities %>';
<% for(const {title} of locals) { %>
  export * from './<%= dasherize(title) %>.<%= dasherize(databaseName) %>'; 
  import { <%= camelize(databaseName) %><%= classify(title) %> } from './<%= dasherize(title) %>.<%= dasherize(databaseName) %>'; 
<% } %>

export const local<%= classify(databaseName) %>: {
  example: <%= classify(databaseName) %>;
  list: <%= classify(databaseName) %>[];
} = {
  example: <%= camelize(databaseName) %><%= classify(locals[0].title) %>,
  list: [
    <% for(const {title} of locals) { %>
      <%= camelize(databaseName) %><%= classify(title) %>,
    <% } %>
  ]
};
