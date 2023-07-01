<% if (options.debug) { %>
  <%= logDebug({ action: 'debugging', message: 'entity: index.ts' }) %>
<% } %>


<% for(const title of titles) { %>
  export * from  './<%= dasherize(title) %>.entity';
<% } %>
<% for(const title of titles) { %>
  import { <%= underscore(title).toUpperCase() %> } from  './<%= dasherize(title) %>.entity';
<% } %>

export const indicies = {
  <% for(const title of titles) { %>
    <%= camelize(title) %>:  <%= underscore(title).toUpperCase() %>,
  <% } %>
};


<% if (options.debug) { %>
  <%= logDebug({ action: 'debugging', message: 'entity: end index.ts' }) %>
<% } %>