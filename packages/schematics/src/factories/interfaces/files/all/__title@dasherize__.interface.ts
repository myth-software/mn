export interface <%= classify(title) %> {
  cover?: string;
  page_id?: string;
  icon?: string;
  <% for(const [property, type] of Object.entries(cache.columns)) { %>
    <% if(type === 'relation' || type === 'multi_select') { %>'<%= property %>'?: string[];<% } else if(type === 'checkbox') { %>'<%= property %>'?: boolean;<% } else if(type === 'rollup') { %>'<%= property %>'?: string | number;<% } else if(type === 'files') { %>'<%= property %>'?: string | string[];<% } else if(type === 'number') { %>'<%= property %>'?: number;<% } else { %>'<%= property %>'?: string;<% } %><% } %>
}