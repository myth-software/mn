import { Server } from 'miragejs';
import { authEndpoints } from './auth.endpoints';
<% for(const title of titles) { %>
  import { <%= camelize(title) %>Endpoints } from './<%= dasherize(title) %>.endpoints';
<% } %>

const endpoints: {
  [title: string]: (server: Server) => void;
} = {
  auth: authEndpoints,
  <% for(const title of titles) { %>
    <%= camelize(title) %>: <%= camelize(title) %>Endpoints,
  <% } %>
};

export { endpoints };