import { local<%= classify(title) %> } from '<%= entities %>';
import { Response, Server } from 'miragejs';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export function <%= camelize(title) %>Endpoints(server: Server) {
  let db: any[] = local<%= classify(title) %>.list;
  server.get('/<%= dasherize(title) %>', () => {
    return new Response(200, {}, db);
  });

  server.post('/<%= dasherize(title) %>', (schema, request) => {
    const partial = JSON.parse(request.requestBody);
    const full = {
      page_id: uuidv4(),
      'created time': new Date().toISOString(),
      ...partial,
    };
    db.unshift(full);
    return new Response(201, {}, full);
  });

  server.get('/<%= dasherize(title) %>/:id', (schema, request) => {
    const page_id = request.params['id'];
    const response = db.find(item => item.page_id === page_id);
    return new Response(200, {}, response);
  });

  server.patch('/<%= dasherize(title) %>/:id', (schema, request) => {
    const page_id = request.params['id'];
    const response = db.find(item => item.page_id === page_id);
    const update = JSON.parse(request.requestBody);
    const updated = {
      ...response,
      ...update,
    };
    db = db.map(item => (item.page_id !== updated.page_id ? item : updated));

    return new Response(200, {}, updated);
  });

  server.delete('/<%= dasherize(title) %>/:id', (schema, request) => {
    const page_id = request.params['id'];
    const index = db.findIndex(item => item.page_id === page_id);
    if (index > -1) {
      db.splice(index, 1);
      return new Response(204, {});
    } else {
      return new Response(500, {});
    }
  });
}
