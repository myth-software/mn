<% if (options.debug) { %>
  <% log.debug({ action: 'debugging', message: `begin notion.d.ts` }) %>
<% } %>

<% for (const scheme of schema) { %>

  export interface <%= classify(scheme.title) %> {
    cover?: string;
    page_id?: string;
    icon?: string;
    <% for(const [property, type] of Object.entries(scheme.columns)) { %>
      <% if(type === 'relation' || type === 'multi_select') { %>
        '<%= property %>'?: string[];
      <% } else if(type === 'checkbox') { %>
        '<%= property %>'?: boolean;
      <% } else if(type === 'rollup') { %>
        '<%= property %>'?: string | number;
      <% } else if(type === 'files') { %>
        '<%= property %>'?: string | string[];
      <% } else if(type === 'number') { %>
        '<%= property %>'?: number;
      <% } else { %>
        '<%= property %>'?: string;
      <% } %>
    <% } %>
  }

<% } %>

<% if (options.debug) { %>
  <% log.debug({ action: 'debugging', message: 'end notion.d.ts' }) %>
<% } %>