<% if (options.debug) { %>
  <% log.debug({ action: 'debugging', message: 'begin: notion.schema.ts' }) %>
<% } %>

  import { InferReadonly, InferWriteonly, MountNotionQueryParameters } from '@mountnotion/types';

<% for (const scheme of schema) { %>
  <% if (options.debug) { %>
    <% log.debug({ action: 'debugging', message: `scheme: title ${scheme.title ? 'is ' + scheme.title : 'is not defined'}` }) %>
  <% } %>


  export const <%= underscore(scheme.title).toUpperCase() %> = {
    title: '<%= scheme.title %>',
    id: '<%= scheme.id %>',
    icon: '<%= scheme.icon %>',
    cover: '<%= scheme.cover %>',
    description: '<%= scheme.description %>',
    columns: { <% for(const [column, type] of Object.entries(scheme.columns)) { %>
      '<%= column %>': '<%= type %>',
    <% } %> },
    <% if(scheme.options) { %>
      options: {
        <% for(const [property, values] of Object.entries(scheme.options)) { %>
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
    <% if(scheme.relations) { %>
      relations: {
        <% for(const [property, relation] of Object.entries(scheme.relations)) { %>
          '<%= property %>': '<%= relation %>',
        <% } %>
      },
    <% } else { %>
      relations: null,
    <% }  %>
    <% if(scheme.syncedColumns) { %>
      syncedColumns: {
        <% for(const [property, syncedColumn] of Object.entries(scheme.syncedColumns)) { %>
          '<%= property %>': '<%= syncedColumn %>',
        <% } %>
      },
    <% } else { %>
      syncedColumns: null,
    <% }  %>
    <% if(scheme.mappings) { %>
      mappings: {
        <% for(const [property, mapping] of Object.entries(scheme.mappings)) { %>
          /** [notion docs for <%= scheme.columns[mapping] %>](https://developers.notion.com/reference/property-object#<%= scheme.columns[mapping].replace('_', '-') %>) */
          '<%= property %>': '<%= mapping %>',
        <% } %>
      },
    <% } else { %>
      mappings: null,
    <% }  %>
    <% if(scheme.rollups) { %>
      rollups: {
        <% for(const [property, rollup] of Object.entries(scheme.rollups)) { %>
          '<%= property %>': '<%= rollup %>',
        <% } %>
      },
    <% } else { %>
      rollups: null,
    <% }  %>
    <% if(scheme.rollupsOptions) { %>
      rollupsOptions: {
        <% for(const [property, rollupsOption] of Object.entries(scheme.rollupsOptions)) { %>
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

  export declare type <%= classify(scheme.title) %>Scheme = typeof <%= underscore(scheme.title).toUpperCase() %>;
  export declare type <%= classify(scheme.title) %>QueryParameters = MountNotionQueryParameters<<%= classify(scheme.title) %>Scheme>;
  export declare type <%= classify(scheme.title) %>Readonly = InferReadonly<<%= classify(scheme.title) %>Scheme>;
  export declare type <%= classify(scheme.title) %>Writeonly = InferWriteonly<<%= classify(scheme.title) %>Scheme>;
  <% if(scheme.description) { %>
  /** <%= scheme.description %> */
  <% } %>
  export declare type <%= classify(scheme.title) %> = <%= classify(scheme.title) %>Readonly & <%= classify(scheme.title) %>Writeonly;

<% } %>


export const SCHEME = {
  <% for(const {title} of scheme) { %>
    <%= camelize(title) %>:  <%= underscore(title).toUpperCase() %>,
  <% } %>
};

<% if (options.debug) { %>
  <% log.debug({ action: 'debugging', message: 'end: notion.schema.ts' }) %>
<% } %>
