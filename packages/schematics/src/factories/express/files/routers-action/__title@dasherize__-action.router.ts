<% if (options.debug) { %>
  <% log.debug({ action: 'debugging', message: `controller: title ${title ? 'is ' + title : 'is not defined'}` }) %>
<% } %>

  import express from 'express';
  import { insert } from <>;
%= classify(title) %>Schema } from '<%= options.drizzle %>';

import <%= camelize(title) %>Controller from '../controllers/<%= dasherize(title) %>.controller';

import middleware from '../middleware';

export const <%= camelize(title) %>ActionRouter = express.Router();

<%= camelize(title) %>ActionRouter.use(middleware.router);

<%= camelize(title) %>ActionRouter.post('/', middleware.create, <%= camelize(title) %>Controller.create);

<%= camelize(title) %>ActionRouter.post('/:id/update',  middleware.updateById, <%= camelize(title) %>Controller.updateById);

<%= camelize(title) %>ActionRouter.post('/:id/delete', middleware.deleteById, <%= camelize(title) %>Controller.deleteById);
