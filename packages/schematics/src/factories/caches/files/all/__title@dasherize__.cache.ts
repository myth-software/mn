<% if (options.debug) { %>
  <% log.debug({ action: 'debugging', message: `cache: title ${cache.title ? 'is ' + cache.title : 'is not defined'}` }) %>
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
  <% if(cache.syncedColumns) { %>
    syncedColumns: {
      <% for(const [property, syncedColumn] of Object.entries(cache.syncedColumns)) { %>
        '<%= property %>': '<%= syncedColumn %>',
      <% } %>
    },
  <% } else { %>
    syncedColumns: null,
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
  <% if(cache.rollups) { %>
    rollups: {
      <% for(const [property, rollup] of Object.entries(cache.rollups)) { %>
        '<%= property %>': '<%= rollup %>',
      <% } %>
    },
  <% } else { %>
    rollups: null,
  <% }  %>
  <% if(cache.rollupsOptions) { %>
    rollupsOptions: {
      <% for(const [property, rollupsOption] of Object.entries(cache.rollupsOptions)) { %>
        '<%= property %>': [
          <% rollupsOption.map((option) => { %>
            '<%= option %>',
          <% }) %>
        ],
      <% } %>
    },
  <% } else { %>
    rollupsOptions: null,
  <% }  %>
} as const;

export declare type <%= classify(cache.title) %>Cache = typeof <%= underscore(cache.title).toUpperCase() %>;
export declare type <%= classify(cache.title) %>QueryParameters = MountNotionQueryParameters<<%= classify(cache.title) %>Cache>;
export declare type <%= classify(cache.title) %>Readonly = InferReadonly<<%= classify(cache.title) %>Cache>;
export declare type <%= classify(cache.title) %>Writeonly = InferWriteonly<<%= classify(cache.title) %>Cache>;
<% if(cache.description) { %>
/** <%= cache.description %> */
<% } %>
export declare type <%= classify(cache.title) %> = <%= classify(cache.title) %>Readonly & <%= classify(cache.title) %>Writeonly;

<% if (options.debug) { %>
  <% log.debug({ action: 'debugging', message: 'cache: end' }) %>
<% } %>