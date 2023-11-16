<% if (options.debug) { %>
  <% log.debug({ action: 'debugging', message: `schema: drizzle.schema.ts` }) %>
<% } %>

import { ReadonlyColumnTypes } from '@mountnotion/types';
import { pgTable, pgEnum, boolean, numeric, serial, text, varchar, uuid, json, timestamp, primaryKey } from "drizzle-orm/pg-core";
<% for (let cache of caches) { %>

  <% for(const [property, column] of Object.entries(cache.mappings)) { const type = cache.columns[column];  %>
    <% if(cache.options?.[column] && type === 'multi_select') {  %>
      export const <%= camelize(cache.title).toLowerCase() %><%= camelize(property).toLowerCase() %> = pgEnum('<%= camelize(cache.title).toLowerCase() %><%= camelize(property).toLowerCase() %>', [
        <% cache.options[column].forEach((option, i, arr) => { %>'<%= option %>', <% }) %>
      ]);
    <% } else if(cache.options?.[column] && (type === 'select' || type === 'status')) {  %>
      export const <%= camelize(cache.title).toLowerCase() %><%= camelize(property).toLowerCase() %> = pgEnum('<%= camelize(cache.title).toLowerCase() %><%= camelize(property).toLowerCase() %>', [
        <% cache.options[column].forEach((option, i, arr) => { %>'<%= option %>', <% }) %>
      ]);
    <% } else if(cache.rollupsOptions?.[column]) {  %>
      export const <%= camelize(cache.title).toLowerCase() %><%= camelize(property).toLowerCase() %> = pgEnum('<%= camelize(cache.title).toLowerCase() %><%= camelize(property).toLowerCase() %>', [
        <% cache.rollupsOptions[column].forEach((option, i, arr) => { %>'<%= option %>', <% }) %>
      ]);
    <% } %>  
  <% } %>

  export const <%= camelize(cache.title) %> = pgTable('<%= decamelize(camelize(cache.title)) %>', {
    id: uuid('id').defaultRandom().primaryKey(),
    icon: text('icon'),
    cover: text('cover'),
    <% for(const [property, column] of Object.entries(cache.mappings)) { const type = cache.columns[column];  %>
      <% if(type === 'rollup' || type === 'last_edited_by' || type === 'last_edited_time' || type === 'created_by' || type === 'created_time' ) { %>
      <% } %>
      <% if(type === 'relation') { %>
        '<%= property %>': uuid('<%= property %>').array(),
      <% } else if(type === 'last_edited_time' || type === 'created_time') { %>
        '<%= property %>': timestamp('<%= property %>').defaultNow(),
      <% } else if(type === 'checkbox') { %>
        '<%= property %>': boolean('<%= property %>').default(false),
      <% } else if(cache.options?.[column] && type === 'multi_select') {  %>
        '<%= property %>': <%= camelize(cache.title).toLowerCase() %><%= camelize(property).toLowerCase() %>('<%= property %>').array(),
      <% } else if(cache.options?.[column] && (type === 'select' || type === 'status')) {  %>
        '<%= property %>': <%= camelize(cache.title).toLowerCase() %><%= camelize(property).toLowerCase() %>('<%= property %>'),
      <% } else if(cache.rollupsOptions?.[column] === 'multi_select') {  %>
        '<%= property %>': <%= camelize(cache.title).toLowerCase() %><%= camelize(property).toLowerCase() %>('<%= property %>').array(),
      <% } else if(cache.rollups?.[column] === 'select' || cache.rollups?.[column] === 'status') {  %>
        '<%= property %>': <%= camelize(cache.title).toLowerCase() %><%= camelize(property).toLowerCase() %>('<%= property %>'),
      <% } else if(cache.rollups?.[column] === 'title') {  %>
        '<%= property %>': text('<%= property %>'),
      <% } else if(cache.rollups?.[column] === 'rich_text') {  %>
        '<%= property %>': text('<%= property %>'),
      <% } else if(cache.rollups?.[column] === 'phone_number') {  %>
        '<%= property %>': text('<%= property %>'),
      <% } else if(cache.rollups?.[column] === 'date') {  %>
        '<%= property %>': timestamp('<%= property %>'),
      <% } else if(cache.rollups?.[column] === 'number') {  %>
        '<%= property %>': numeric('<%= property %>'),
      <% } else if(cache.rollups?.[column] === 'relation') {  %>
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

  <% if(cache.description) { %>
  /** <%= cache.description %> */
  <% } %>
  export declare type <%= classify(cache.title) %> = typeof <%= camelize(cache.title) %>.$inferSelect;
  export declare type <%= classify(cache.title) %>WriteOnly = Omit<<%= classify(cache.title) %>, ReadonlyColumnTypes>;
  export declare type New<%= classify(cache.title) %> = typeof <%= camelize(cache.title) %>.$inferInsert;

<% } %>

<% if (options.debug) { %>
  <% log.debug({ action: 'debugging', message: 'schema: end' }) %>
<% } %>