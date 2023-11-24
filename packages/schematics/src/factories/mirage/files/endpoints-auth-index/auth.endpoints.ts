<% if (options.debug) { %>
  <% log.debug({ action: 'debugging', message: 'begin: mirage auth endpoints' }) %>
<% } %>

import { fixture<%= classify(options.usersDatabase) %> } from '<%= options.fixtures %>';
import { Response, Server } from 'miragejs';

export function authEndpoints(server: Server) {
  server.get(`/a/sms/profile`, () => {
    return new Response(200, {}, fixture<%= classify(options.usersDatabase) %>.example);
  });

  server.post(`/a/sms/login-initialization`, () => {
    return new Response(204, {});
  });

  server.post(`/a/sms/login`, () => {
    return new Response(
      200,
      {},
      { accessToken: '123jtb', refreshToken: '', exp: 1234 }
    );
  });
}

<% if (options.debug) { %>
  <% log.debug({ action: 'debugging', message: 'end: mirage auth endpoints' }) %>
<% } %>