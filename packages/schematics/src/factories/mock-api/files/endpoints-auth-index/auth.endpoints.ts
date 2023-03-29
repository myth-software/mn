import { <%= underscore(usersDatabase).toUpperCase() %> } from '<%= entities %>';
import { Response, Server } from 'miragejs';

export function authEndpoints(server: Server) {
  server.get(`/a/sms/profile`, () => {
    return new Response(200, {}, <%= underscore(usersDatabase).toUpperCase() %>.mock);
  });

  server.post(`/a/sms/login-initalization`, () => {
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
