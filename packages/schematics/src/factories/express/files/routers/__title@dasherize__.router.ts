<% if (options.debug) { %>
  <%= log.debug({ action: 'debugging', message: `controller: title ${title ? 'is ' + title : 'is not defined'}` }) %>
<% } %>

import express, { Request, Response } from 'express';

<%= classify(title) %>Cmport controller from '../controllers/<%= dasherize(title) %>.controller';

import middleware from '../middleware';

export const <%= camelize(title) %>Router = express.Router();

<%= camelize(title) %>Router.use(middleware.router);

<%= camelize(title) %>Router.get('/', middleware.query, <%= classify(title) %>Controller.query);

<%= camelize(title) %>Router.get('/:id', middleware.getById, <%= classify(title) %>Controller.getById);

<%= camelize(title) %>Router.post('/', middleware.create, <%= classify(title) %>Controller.create);

<%= camelize(title) %>Router.patch('/:id',  middleware.updateById, <%= Classify(title) %>Controller.updateById);

<%= camelize(title) %>Router.delete('/:id', middleware.deleteById, <%= classify(title) %>Controller.deleteById);
