import { ReadonlyColumnTypes } from '@mountnotion/types';
import { InferModel } from 'drizzle-orm';
import { pgTable, pgEnum, boolean, numeric, serial, text, varchar, uuid, json, timestamp } from "drizzle-orm/pg-core";
 
<% for(const [property, column] of Object.entries(cache.mappings)) { const type = cache.columns[column];  %>
  <% if(cache.options?.[column] && type === 'multi_select') {  %>
    export const <%= camelize(title) %><%= classify(property) %> = pgEnum('<%= property %>', [
      <% cache.options[column].forEach((option, i, arr) => { %>'<%= option %>', <% }) %>
    ]);
  <% } else if(cache.options?.[column] && (type === 'select' || type === 'status')) {  %>
    export const <%= camelize(title) %><%= classify(property) %> = pgEnum('<%= property %>', [
      <% cache.options[column].forEach((option, i, arr) => { %>'<%= option %>', <% }) %>
    ]);
  <% } else if(cache.rollupsOptions?.[property]) {  %>
    export const <%= camelize(title) %><%= classify(property) %> = pgEnum('<%= property %>', [
      <% cache.rollupsOptions[property].forEach((option, i, arr) => { %>'<%= option %>', <% }) %>
    ]);
  <% } %>  
<% } %>

export const <%= camelize(title) %> = pgTable('<%= dasherize(title) %>', {
  id: uuid('id').defaultRandom().primaryKey(),
  icon: text('icon').notNull(),
  cover: text('cover').notNull(),
  description: text('description').notNull(),
  <% for(const [property, column] of Object.entries(cache.mappings)) { const type = cache.columns[column];  %>
    '<%= property %>':
      <% if(type === 'rollup' || type === 'last_edited_by' || type === 'last_edited_time' || type === 'created_by' || type === 'created_time' ) { %>
      <% } %>
      <% if(type === 'relation') { %>
        text('<%= property %>').array()
      <% } else if(type === 'last_edited_time' || type === 'created_time') { %>
        timestamp('<%= property %>').defaultNow()
      <% } else if(type === 'checkbox') { %>
        boolean('<%= property %>')
      <% } else if(cache.options?.[column] && type === 'multi_select') {  %>
        <%= camelize(title) %><%= classify(property) %>('<%= property %>').array()
      <% } else if(cache.options?.[column] && (type === 'select' || type === 'status')) {  %>
        <%= camelize(title) %><%= classify(property) %>('<%= property %>')
      <% } else if(cache.rollupsOptions?.[property]) {  %>
        <%= camelize(title) %><%= classify(property) %>('<%= property %>').array()
      <% } else if(type === 'rollup') { %>
      <% } else if(type === 'files') { %>
        text('<%= property %>').array()
      <% } else if(type === 'number') { %>
        numeric('<%= property %>')
      <% } else { %>
        text('<%= property %>')
      <% } %>
    ,
  <% } %>
});

<% if(cache.description) { %>
/** <%= cache.description %> */
<% } %>
export declare type <%= classify(title) %> = InferModel<typeof <%= camelize(title) %>>;
export declare type <%= classify(title) %>WriteOnly = Omit<<%= classify(title) %>, ReadonlyColumnTypes>;
export declare type New<%= classify(title) %> = InferModel<typeof <%= camelize(title) %>, 'insert'>;
