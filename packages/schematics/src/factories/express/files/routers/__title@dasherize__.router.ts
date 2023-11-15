<% if (options.debug) { %>
  <% log.debug({ action: 'debugging', message: `controller: title ${title ? 'is ' + title : 'is not defined'}` }) %>
<% } %>

import express, { Request, Response } from 'express';
import { insert<%= classify(title) %>Schema } from '<%= options.drizzle %>';

import <%= camelize(title) %>Controller from '../controllers/<%= dasherize(title) %>.controller';

import middleware from '../middleware';

export const <%= camelize(title) %>Router = express.Router();

<%= camelize(title) %>Router.use(middleware.router);

<%= camelize(title) %>Router.get('/', middleware.query, <%= camelize(title) %>Controller.query);

<%= camelize(title) %>Router.get('/:id', middleware.getById, <%= camelize(title) %>Controller.getById);

<%= camelize(title) %>Router.post('/', middleware.create, <%= camelize(title) %>Controller.create);

<%= camelize(title) %>Router.patch('/:id',  middleware.updateById, <%= camelize(title) %>Controller.updateById);

<%= camelize(title) %>Router.delete('/:id', middleware.deleteById, <%= camelize(title) %>Controller.deleteById);
