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
      <% for(const [property, type] of Object.entries(index.types)) { const dbProperty = index.database.properties[property]; %>
        '<%= property %>': {
        nullable: true,
      <% if(dbProperty.rollup || dbProperty.last_edited_by || dbProperty.last_edited_time || dbProperty.created_by || dbProperty.created_time ) { %>
        readOnly: true,
      <% } %>
      <% if(type === 'relation') { %>
        type: 'array',
        items: {
          type: 'string'
        }
      <% } else if(type === 'checkbox') { %>
        type: 'boolean',
      <% } else if(type === 'multi_select' && dbProperty.multi_select) {  %>
        type: 'array',
        items: {
          type: 'string',
          enum: [
      
      <% dbProperty.multi_select.options.forEach((option, i, arr) => { %>'<%= option.name %>', <% }) %>
          ]
        }
      <% } else if(type === 'multi_select' && !dbProperty.multi_select) {  %>
        type: 'array',
        items: {
          type: 'string',
          enum: [
      
      <% index.rollup[property].forEach((option, i, arr) => { %>'<%= option.name %>', <% }) %>
          ]
        }
      <% } else if(type === 'select' && dbProperty.select) {  %>
        type: 'string',
        enum: [
          <% dbProperty.select.options.forEach((option, i, arr) => {%>'<%= option.name %>', <% }) %>
        ]
      <% } else if(type === 'select' && !dbProperty.select) {  %>
        type: 'string',
        enum: [
          <% index.rollup[property].forEach((option, i, arr) => { %>'<%= option.name %>', <% }) %>
        ],
      <% } else if(type === 'status' && dbProperty.status) {  %>
        type: 'string',
        enum: [
          <% dbProperty.status.options.forEach((option, i, arr) => {%>'<%= option.name %>', <% }) %>
        ]
      <% } else if(type === 'status' && !dbProperty.status) {  %>
        type: 'string',
        enum: [
          <% index.rollup[property].forEach((option, i, arr) => { %>'<%= option.name %>', <% }) %>
        ]
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