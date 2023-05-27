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
