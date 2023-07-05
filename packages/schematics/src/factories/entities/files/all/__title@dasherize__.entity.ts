<% if (options.debug) { %>
  <%= log.debug({ action: 'debugging', message: `entity: title ${cache.title ? 'is ' + cache.title : 'is not defined'}` }) %>
<% } %>

import { InferReadonly, InferWriteonly, MountNotionQueryParameters } from '@mountnotion/types';

export const <%= underscore(cache.title).toUpperCase() %> = {
  title: '<%= cache.title %>',
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

export declare type <%= classify(cache.title) %>Index = typeof <%= underscore(cache.title).toUpperCase() %>;
export declare type <%= classify(cache.title) %>QueryParameters = MountNotionQueryParameters<<%= classify(cache.title) %>Index>;
export declare type <%= classify(cache.title) %>Readonly = InferReadonly<<%= classify(cache.title) %>Index>;
export declare type <%= classify(cache.title) %>Writeonly = InferWriteonly<<%= classify(cache.title) %>Index>;
<% if(cache.description) { %>
/** <%= cache.description %> */
<% } %>
export declare type <%= classify(cache.title) %> = <%= classify(cache.title) %>Readonly & <%= classify(cache.title) %>Writeonly;

<% if (options.debug) { %>
  <%= log.debug({ action: 'debugging', message: 'entity: end' }) %>
<% } %>