<% if (options.debug) { %>
  <% log.debug({ action: 'debugging', message: 'begin: fixtures all-for-schema' }) %>
  <% log.debug({ action: 'debugging', message: `databaseName is ${databaseName}` }) %>
  <% log.debug({ action: 'debugging', message: `title is ${title}` }) %>
<% } %>

    import { } from <>
%= classify(databaseName) %>
} from '<%= options.schema %>';

export const <%= camelize(databaseName) %><%= classify(title) %>: <%= classify(databaseName) %> = {
  <% for(const [property, value] of Object.entries(fixture)) { %>
    <% if(Array.isArray(value)) { %>
      '<%= property %>': [
        <% value.map(v => { %>
          '<%= v %>',
        <% }); %>
      ],  
    <% } %>
    <% if(typeof value === 'string') { %>
      '<%= property %>': "<%= value %>",
    <% } %>
    <% if(typeof value === 'boolean') { %>
      '<%= property %>': <%= value %>,
    <% } %>
    <% if(typeof value === 'number') { %>
      '<%= property %>': <%= value %>,
    <% } %>
    <% if(value === null) { %>
      '<%= property %>': null,
    <% } %>
  <% } %>
};

<% if (options.debug) { %>
  <% log.debug({ action: 'debugging', message: 'end: fixtures all-for-schema' }) %>
<% } %>