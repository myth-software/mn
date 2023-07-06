import { ReadonlyColumnTypes } from '@mountnotion/types';
import { InferModel } from 'drizzle-orm';
import { pgTable, pgEnum, boolean, numeric, serial, text, varchar, uuid, json, timestamp } from "drizzle-orm/pg-core";
 
<% for(const [property, column] of Object.entries(cache.mappings)) { const type = cache.columns[column];  %>
  <% if(cache.options?.[column] && type === 'multi_select') {  %>
    export const <%= camelize(title).toLowerCase() %><%= camelize(property).toLowerCase() %> = pgEnum('<%= camelize(title).toLowerCase() %><%= camelize(property).toLowerCase() %>', [
      <% cache.options[column].forEach((option, i, arr) => { %>'<%= option %>', <% }) %>
    ]);
  <% } else if(cache.options?.[column] && (type === 'select' || type === 'status')) {  %>
    export const <%= camelize(title).toLowerCase() %><%= camelize(property).toLowerCase() %> = pgEnum('<%= camelize(title).toLowerCase() %><%= camelize(property).toLowerCase() %>', [
      <% cache.options[column].forEach((option, i, arr) => { %>'<%= option %>', <% }) %>
    ]);
  <% } else if(cache.rollupsOptions?.[property]) {  %>
    export const <%= camelize(title).toLowerCase() %><%= camelize(property).toLowerCase() %> = pgEnum('<%= camelize(title).toLowerCase() %><%= camelize(property).toLowerCase() %>', [
      <% cache.rollupsOptions[property].forEach((option, i, arr) => { %>'<%= option %>', <% }) %>
    ]);
  <% } %>  
<% } %>

export const <%= camelize(title) %> = pgTable('<%= dasherize(title) %>', {
  id: uuid('id').defaultRandom().primaryKey(),
  icon: text('icon'),
  cover: text('cover'),
  <% for(const [property, column] of Object.entries(cache.mappings)) { const type = cache.columns[column];  %>
    <% if(type === 'rollup' || type === 'last_edited_by' || type === 'last_edited_time' || type === 'created_by' || type === 'created_time' ) { %>
    <% } %>
    <% if(type === 'relation') { %>
    <% } else if(type === 'last_edited_time' || type === 'created_time') { %>
      '<%= property %>': timestamp('<%= property %>').defaultNow(),
    <% } else if(type === 'checkbox') { %>
      '<%= property %>': boolean('<%= property %>'),
    <% } else if(cache.options?.[column] && type === 'multi_select') {  %>
      '<%= property %>': <%= camelize(title).toLowerCase() %><%= camelize(property).toLowerCase() %>('<%= property %>').array(),
    <% } else if(cache.options?.[column] && (type === 'select' || type === 'status')) {  %>
      '<%= property %>': <%= camelize(title).toLowerCase() %><%= camelize(property).toLowerCase() %>('<%= property %>'),
    <% } else if(cache.rollupsOptions?.[property]) {  %>
      '<%= property %>': <%= camelize(title).toLowerCase() %><%= camelize(property).toLowerCase() %>('<%= property %>').array(),
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
export declare type <%= classify(title) %> = InferModel<typeof <%= camelize(title) %>>;
export declare type <%= classify(title) %>WriteOnly = Omit<<%= classify(title) %>, ReadonlyColumnTypes>;
export declare type New<%= classify(title) %> = InferModel<typeof <%= camelize(title) %>, 'insert'>;
