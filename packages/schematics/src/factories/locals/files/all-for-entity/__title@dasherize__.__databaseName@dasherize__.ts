<% if (options.debug) { %>
  <%= log.debug({ action: 'debugging', message: 'locals all-for-entity' }) %>
  <%= log.debug({ action: 'debugging', message: `databaseName is ${databaseName}` }) %>
  <%= log.debug({ action: 'debugging', message: `title is ${title}` }) %>
<% } %>

import { <%= classify(databaseName) %> } from '<%= entities %>';

export const <%= camelize(databaseName) %><%= classify(title) %>: <%= classify(databaseName) %> = {
  <% for(const [property, value] of Object.entries(local)) { %>
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
