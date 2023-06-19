<% if (debug) { %>
  <%= logDebug({ action: 'debugging', message: `schema: cache ${cache ? 'is defined': 'is not defined'}` }) %>
<% } %>

export const oasSchema = {  
  type: 'object', 
  properties: {
    id: {
    type: 'string',
      readOnly: true,
      nullable: true
    },
    icon: {
      type: 'string',
      readOnly: true,
      nullable: true
    },
    cover: {
      type: 'string',
      readOnly: true,
      nullable: true
    },
      <% for(const [property, column] of Object.entries(cache.mappings)) { const type = cache.columns[column];  %>
        '<%= property %>': {
        nullable: true,
      <% if(type === 'rollup' || type === 'last_edited_by' || type === 'last_edited_time' || type === 'created_by' || type === 'created_time' ) { %>
        readOnly: true,
      <% } %>
      <% if(type === 'relation') { %>
        type: 'array',
        items: {
          type: 'string'
        }
      <% } else if(type === 'checkbox') { %>
        type: 'boolean',
      <% } else if(cache.options?.[column] && type === 'multi_select') {  %>
        type: 'array',
        items: {
          type: 'string',
          enum: [
            <% cache.options[column].forEach((option, i, arr) => { %>'<%= option %>', <% }) %>
          ]
        }
      <% } else if(cache.options?.[column] && (type === 'select' || type === 'status')) {  %>
        type: 'string',
          enum: [
            <% cache.options[column].forEach((option, i, arr) => { %>'<%= option %>', <% }) %>
          ]
      <% } else if(cache.rollupsOptions?.[property]) {  %>
        type: 'array',
        items: {
          type: 'string',
          enum: [
            <% cache.rollupsOptions[property].forEach((option, i, arr) => { %>'<%= option %>', <% }) %>
          ]
        }
      <% } else if(type === 'rollup') { %>
        anyOf: [
          {
            type: 'number',
          },
          {
            type: 'array',
            items: {
              type: 'number',
            }
          },
          {
            type: 'boolean',
          },
          {
            type: 'array',
            items: {
              type: 'boolean',
            }
          },
          {
            type: 'string',
          },
          {
            type: 'array',
            items: {
              type: 'string',
            }
          },
        ],
      <% } else if(type === 'files') { %>
        type: 'array',
        items: {
          type: 'string'
        }
      <% } else if(type === 'number') { %>
        type: 'number',
      <% } else { %>
        type: 'string',
      <% } %>    
    },
  <% } %>
  }
};
