<% if (options.debug) { %>
  <% log.debug({ action: 'debugging', message: 'begin: valibot.scheme.ts' }) %>
<% } %>

  import { array, boolean, number, object, string, uuid } from 'valibot';

<% for (const scheme of scheme) { %>

  export const <%= camelize(scheme.title) %>SchemeReadonly = object({
    cover: string(),
    id: string([uuid()]),
    icon: string(),
    <% for(const { isArray, isUuid, isDate, options, primitive, property } of scheme.scheme.filter(s => s.readonly)) { %>
      '<%= property %>': 
      <% if(isArray) { %>
        array
      <% } %>
      ( 
      <% if(primitive === 'enum') { %>
        enum([
          <% options.map((option) => {%>
            '<%= option %>',
          <% }) %>
        ])
      <% } else if(primitive === 'rollup') { %>
        union([
          number(),
          array(number()),
          boolean(),
          array(boolean()),
          string(),
          array(string())
        ])
      <% } else { %>
        <%= primitive %>(
        [
          <% if(isUuid) { %>
            uuid(),
          <% } %>
          <% if(isDate) { %>
            .datetime(),
          <% } %>
        ])
      <% } %>
      ),
    <% } %>
  });

  export const <%= camelize(scheme.title) %>SchemeWriteonly = object({
    <% for(const { isArray, isUuid, isDate, options, primitive, property } of scheme.scheme.filter(s => s.readonly)) { %>
      '<%= property %>': 
      <% if(isArray) { %>
        array
      <% } %>
      ( 
      <% if(primitive === 'enum') { %>
        enum([
          <% options.map((option) => {%>
            '<%= option %>',
          <% }) %>
        ])
      <% } else if(primitive === 'rollup') { %>
        union([
          number(),
          array(number()),
          boolean(),
          array(boolean()),
          string(),
          array(string())
        ])
      <% } else { %>
        <%= primitive %>(
        [
          <% if(isUuid) { %>
            uuid(),
          <% } %>
          <% if(isDate) { %>
            datetime(),
          <% } %>
        ])
      <% } %>
      ),
    <% } %>
  });

  export const <%= camelize(scheme.title) %>Scheme = merge([<%= camelize(scheme.title) %>SchemeWriteonly,<%= camelize(scheme.title) %>SchemeReadonly]);

<% } %>

<% if (options.debug) { %>
  <% log.debug({ action: 'debugging', message: 'end: valibot.scheme.ts' }) %>
<% } %>