<% if (options.debug) { %>
  <%= log.debug({ action: 'debugging', message: `controller: title ${title ? 'is ' + title : 'is not defined'}` }) %>
<% } %>

import express, { Request, Response } from 'express';
import { insert<%= classify(title) %>Schema } from '<%= options.drizzle %>';

import <%= camelize(title) %>Controller from '../controllers/<%= dasherize(title) %>.controller';

import middleware from '../middleware';

export const <%= camelize(title) %>ActionRouter = express.Router();

<%= camelize(title) %>Router.use(middleware.router);

<%= camelize(title) %>Router.post('/', middleware.create, <%= camelize(title) %>Controller.create);

<%= camelize(title) %>Router.post('/:id/update',  middleware.updateById, <%= camelize(title) %>Controller.updateById);

<%= camelize(title) %>Router.post('/:id/delete', middleware.deleteById, <%= camelize(title) %>Controller.deleteById);
