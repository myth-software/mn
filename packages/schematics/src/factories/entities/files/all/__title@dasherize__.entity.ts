import { MountNotionQueryParameters, InferReadonly, InferWriteonly } from '@mountnotion/types';

export const <%= underscore(title).toUpperCase() %> = {
  title: '<%= title %>',
  id: '<%= id %>',
  icon: '<%= icon %>',
  cover: '<%= cover %>',
  description: '<%= description %>',
  columns: { <% for(const [column, type] of Object.entries(columns)) { %>
    '<%= column %>': '<%= type %>',
  <% } %> },
  <% if(options) { %>
    options: {
      <% for(const [property, values] of Object.entries(options)) { %>
        '<%= property %>': [
          <% values.map((option) => { %>
            '<%= option %>',
          <% }) %>
        ],
      <% } %>
    },
  <% } else { %>
    options: null,
  <% }  %>  
  <% if(relations) { %>
    relations: {
      <% for(const [property, relation] of Object.entries(relations)) { %>
        '<%= property %>': '<%= relation %>',
      <% } %>
    },
  <% } else { %>
    relations: null
  <% }  %>
} as const;

export declare type <%= classify(title) %>Index = typeof <%= underscore(title).toUpperCase() %>;
export declare type <%= classify(title) %>QueryParameters = MountNotionQueryParameters<<%= classify(title) %>Index>;
export declare type <%= classify(title) %>Readonly = InferReadonly<<%= classify(title) %>Index>;
export declare type <%= classify(title) %>Writeonly = InferWriteonly<<%= classify(title) %>Index>;
<% if(description) { %>
/** <%= description %> */
<% } %>
export declare type <%= classify(title) %> = <%= classify(title) %>Readonly & <%= classify(title) %>Writeonly;
