<% if (options.debug) { %>
  <% log.debug({ action: 'debugging', message: `schema: schema ${schema ? 'is defined': 'is not defined'}` }) %>
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
      <% for(const [property, column] of Object.entries(schema.mappings)) { const type = schema.columns[column];  %>
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
      <% } else if(schema.options?.[column] && type === 'multi_select') {  %>
        type: 'array',
        items: {
          type: 'string',
          enum: [
            <% schema.options[column].forEach((option, i, arr) => { %>'<%= option %>', <% }) %>
          ]
        }
      <% } else if(schema.options?.[column] && (type === 'select' || type === 'status')) {  %>
        type: 'string',
          enum: [
            <% schema.options[column].forEach((option, i, arr) => { %>'<%= option %>', <% }) %>
          ]
      <% } else if(schema.rollupsOptions?.[property]) {  %>
        type: 'array',
        items: {
          type: 'string',
          enum: [
            <% schema.rollupsOptions[property].forEach((option, i, arr) => { %>'<%= option %>', <% }) %>
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
