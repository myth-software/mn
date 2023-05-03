export const <%= camelize(title) %> = {
  column: { <% for(const [column, type] of Object.entries(columns)) { %>
    '<%= column %>': '<%= type %>',
  <% } %> },
  <% if(options) { %>
    option: {
      <% for(const [property, values] of Object.entries(options)) { %>
        '<%= property %>': <%= JSON.stringify(values) %>,
      <% } %>
    }
  <% } %>
};
