import { z } from 'zod';

export const <%= camelize(title) %>SchemaReadonly = z.object({
  cover: z.string(),
  id: z.string().uuid(),
  icon: z.string(),
  <% for(const { isArray, isUuid, isDate, options, primitive, property } of cache.schema.filter(s => s.readonly)) { %>
    '<%= property %>': 
    <% if(isArray) { %>
      z.array
    <% } %>
    ( 
    <% if(primitive === 'enum') { %>
      z.enum([
        <% options.map((option) => {%>
          '<%= option %>',
        <% }) %>
      ])
    <% } else if(primitive === 'rollup') { %>
      z.union([
        z.number(),
        z.array(z.number()),
        z.boolean(),
        z.array(z.boolean()),
        z.string(),
        z.array(z.string())
      ])
    <% } else { %>
      z.<%= primitive %>()
    <% } %>
    <% if(isUuid) { %>
      .uuid()
    <% } %>
    <% if(isDate) { %>
      .datetime()
    <% } %>
    ),
  <% } %>
});

export const <%= camelize(title) %>SchemaWriteonly = z.object({
  <% for(const { isArray, isUuid, isDate, options, primitive, property } of cache.schema.filter(s => !s.readonly)) { %>
    '<%= property %>': 
    <% if(isArray) { %>
      z.array
    <% } %>
    ( 
    <% if(primitive === 'enum') { %>
      z.enum([
        <% options.map((option) => {%>
          '<%= option %>',
        <% }) %>
      ])
    <% } else if(primitive === 'rollup') { %>
      z.union([
        z.number(),
        z.array(z.number()),
        z.boolean(),
        z.array(z.boolean()),
        z.string(),
        z.array(z.string())
      ])
    <% } else { %>
      z.<%= primitive %>()
    <% } %>
    <% if(isUuid) { %>
      .uuid()
    <% } %>
    <% if(isDate) { %>
      .datetime()
    <% } %>
    ),
  <% } %>
});

export const <%= camelize(title) %>Schema = <%= camelize(title) %>SchemaWriteonly.merge(<%= camelize(title) %>SchemaReadonly);
