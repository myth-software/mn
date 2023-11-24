<% if (options.debug) { %>
  <% log.debug({ action: 'debugging', message: 'begin: fixtures index-for-schema' }) %>
  <% log.debug({ action: 'debugging', message: `databaseName is ${databaseName}` }) %>
<% } %>
    import { } from <>
%= classify(databaseName) %>
} from '<%= options.schema %>';

<% for(const {title} of fixtures) { %>
  export * from './<%= dasherize(title) %>.<%= dasherize(databaseName) %>'; 
  import { <%= camelize(databaseName) %><%= classify(title) %> } from './<%= dasherize(title) %>.<%= dasherize(databaseName) %>'; 
<% } %>

export const fixture<%= classify(databaseName) %>: {
  example: <%= classify(databaseName) %>;
  list: <%= classify(databaseName) %>[];
} = {
  example: <%= camelize(databaseName) %><%= classify(fixtures[0].title) %>,
  list: [
    <% for(const {title} of fixtures) { %>
      <%= camelize(databaseName) %><%= classify(title) %>,
    <% } %>
  ]
};

<% if (options.debug) { %>
  <% log.debug({ action: 'debugging', message: 'end: fixtures index-for-schema' }) %
<% } %>