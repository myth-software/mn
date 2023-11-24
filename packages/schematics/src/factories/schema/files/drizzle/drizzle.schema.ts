<% if (options.debug) { %>
  <% log.debug({ action: 'debugging', message: `begin: drizzle.schema.ts` }) %>
<% } %>

  import { AdditionalPropertyTypes, ReadonlyColumnTypes } from '@mountnotion/types';
    import { boolean, numeric, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
<% for (const scheme of schema) { %>

  <% for(const [property, column] of Object.entries(scheme.mappings)) { const type = scheme.columns[column];  %>
    <% if(scheme.options?.[column] && type === 'multi_select') {  %>
      export const <%= camelize(scheme.title).toLowerCase() %><%= camelize(property).toLowerCase() %> = pgEnum('<%= camelize(scheme.title).toLowerCase() %><%= camelize(property).toLowerCase() %>', [
        <% scheme.options[column].forEach((option, i, arr) => { %>'<%= option %>', <% }) %>
      ]);
    <% } else if(scheme.options?.[column] && (type === 'select' || type === 'status')) {  %>
      export const <%= camelize(scheme.title).toLowerCase() %><%= camelize(property).toLowerCase() %> = pgEnum('<%= camelize(scheme.title).toLowerCase() %><%= camelize(property).toLowerCase() %>', [
        <% scheme.options[column].forEach((option, i, arr) => { %>'<%= option %>', <% }) %>
      ]);
    <% } else if(scheme.rollupsOptions?.[column]) {  %>
      export const <%= camelize(scheme.title).toLowerCase() %><%= camelize(property).toLowerCase() %> = pgEnum('<%= camelize(scheme.title).toLowerCase() %><%= camelize(property).toLowerCase() %>', [
        <% scheme.rollupsOptions[column].forEach((option, i, arr) => { %>'<%= option %>', <% }) %>
      ]);
    <% } %>  
  <% } %>

  export const <%= camelize(scheme.title) %> = pgTable('<%= decamelize(camelize(scheme.title)) %>', {
    id: uuid('id').defaultRandom().primaryKey(),
    icon: text('icon'),
    cover: text('cover'),
    <% for(const [property, column] of Object.entries(scheme.mappings)) { const type = scheme.columns[column];  %>
      <% if(type === 'rollup' || type === 'last_edited_by' || type === 'last_edited_time' || type === 'created_by' || type === 'created_time' ) { %>
      <% } %>
      <% if(type === 'relation') { %>
        '<%= property %>': uuid('<%= property %>').array(),
      <% } else if(type === 'last_edited_time' || type === 'created_time') { %>
        '<%= property %>': timestamp('<%= property %>').defaultNow(),
      <% } else if(type === 'checkbox') { %>
        '<%= property %>': boolean('<%= property %>').default(false),
      <% } else if(scheme.options?.[column] && type === 'multi_select') {  %>
        '<%= property %>': <%= camelize(scheme.title).toLowerCase() %><%= camelize(property).toLowerCase() %>('<%= property %>').array(),
      <% } else if(scheme.options?.[column] && (type === 'select' || type === 'status')) {  %>
        '<%= property %>': <%= camelize(scheme.title).toLowerCase() %><%= camelize(property).toLowerCase() %>('<%= property %>'),
      <% } else if(scheme.rollupsOptions?.[column] === 'multi_select') {  %>
        '<%= property %>': <%= camelize(scheme.title).toLowerCase() %><%= camelize(property).toLowerCase() %>('<%= property %>').array(),
      <% } else if(scheme.rollups?.[column] === 'select' || scheme.rollups?.[column] === 'status') {  %>
        '<%= property %>': <%= camelize(scheme.title).toLowerCase() %><%= camelize(property).toLowerCase() %>('<%= property %>'),
      <% } else if(scheme.rollups?.[column] === 'title') {  %>
        '<%= property %>': text('<%= property %>'),
      <% } else if(scheme.rollups?.[column] === 'rich_text') {  %>
        '<%= property %>': text('<%= property %>'),
      <% } else if(scheme.rollups?.[column] === 'phone_number') {  %>
        '<%= property %>': text('<%= property %>'),
      <% } else if(scheme.rollups?.[column] === 'date') {  %>
        '<%= property %>': timestamp('<%= property %>'),
      <% } else if(scheme.rollups?.[column] === 'number') {  %>
        '<%= property %>': numeric('<%= property %>'),
      <% } else if(scheme.rollups?.[column] === 'relation') {  %>
        '<%= property %>': text('<%= property %>').array(),
      <% } else if(type === 'rollup') { %>
      <% } else if(type === 'files') { %>
        '<%= property %>': text('<%= property %>').array(),
      <% } else if(type === 'number') { %>
        '<%= property %>': numeric('<%= property %>'),
      <% } else { %>
        '<%= property %>': text('<%= property %>'),
      <% } %>
    <% } %>
  });

  <% if(scheme.description) { %>
  /** <%= scheme.description %> */
  <% } %>
  export declare type <%= classify(scheme.title) %> = typeof <%= camelize(scheme.title) %>.$inferSelect;
  export declare type <%= classify(scheme.title) %>Writeonly = Omit<<%= classify(scheme.title) %>, ReadonlyColumnTypes | AdditionalPropertyTypes>;
  export declare type New<%= classify(scheme.title) %> = typeof <%= camelize(scheme.title) %>.$inferInsert;

<% } %>

<% if (options.debug) { %>
  <% log.debug({ action: 'debugging', message: 'end: drizzle.schema.ts' }) %>
<% } %>