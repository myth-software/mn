import { createServer } from 'miragejs';
import { endpoints } from './endpoints';
import { models } from './models';

export function startMirage() {
  const server = createServer({
    models,
  });
  server.logging = true;

  server.urlPrefix = '<%= baseUrl %>';
  for (const namespace of Object.keys(endpoints)) {
    endpoints[namespace](server);
  }

  server.namespace = '';
  server.passthrough();
  server.passthrough(request => !request.url.startsWith('<%= baseUrl %>'));

  return server;
}
