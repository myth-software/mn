<% if (options.debug) { %>
  <%= logDebug({ action: 'debugging', message: `entity: title ${title ? 'is ' + title : 'is not defined'}` }) %>
<% } %>

import { InferReadonly, InferWriteonly, MountNotionQueryParameters } from '@mountnotion/types';

export const <%= underscore(title).toUpperCase() %> = {
  title: '<%= title %>',
  id: '<%= cache.id %>',
  icon: '<%= cache.icon %>',
  cover: '<%= cache.cover %>',
  description: '<%= cache.description %>',
  columns: { <% for(const [column, type] of Object.entries(cache.columns)) { %>
    '<%= column %>': '<%= type %>',
  <% } %> },
  <% if(cache.options) { %>
    options: {
      <% for(const [property, values] of Object.entries(cache.options)) { %>
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
  <% if(cache.relations) { %>
    relations: {
      <% for(const [property, relation] of Object.entries(cache.relations)) { %>
        '<%= property %>': '<%= relation %>',
      <% } %>
    },
  <% } else { %>
    relations: null,
  <% }  %>
  <% if(cache.mappings) { %>
    mappings: {
      <% for(const [property, mapping] of Object.entries(cache.mappings)) { %>
        /** [notion docs for <%= cache.columns[mapping] %>](https://developers.notion.com/reference/property-object#<%= cache.columns[mapping].replace('_', '-') %>) */
        '<%= property %>': '<%= mapping %>',
      <% } %>
    },
  <% } else { %>
    mappings: null,
  <% }  %>
} as const;

export declare type <%= classify(title) %>Index = typeof <%= underscore(title).toUpperCase() %>;
export declare type <%= classify(title) %>QueryParameters = MountNotionQueryParameters<<%= classify(title) %>Index>;
export declare type <%= classify(title) %>Readonly = InferReadonly<<%= classify(title) %>Index>;
export declare type <%= classify(title) %>Writeonly = InferWriteonly<<%= classify(title) %>Index>;
<% if(cache.description) { %>
/** <%= cache.description %> */
<% } %>
export declare type <%= classify(title) %> = <%= classify(title) %>Readonly & <%= classify(title) %>Writeonly;
