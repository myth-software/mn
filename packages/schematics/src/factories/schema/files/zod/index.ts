<% for(const title of titles) { %>
  export * from  './<%= dasherize(title) %>.zod';
<% } %>
