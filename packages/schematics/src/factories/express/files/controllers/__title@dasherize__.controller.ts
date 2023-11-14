<% if (options.debug) { %>
  <%= log.debug({ action: 'debugging', message: `router: title ${title ? 'is ' + title : 'is not defined'}` }) %>
<% } %>

import { Request, Response } from 'express';
import { 
  <%= classify(title) %>,
  <%= classify(title) %>Index
} from '<%= options.entities %>';
import { MountNotionQueryParameters, QueryFilter } from '@mountnotion/types';
import { mn } from '../mn';

async function query(req: Request, res: Response) {
    const where = req.query
      .where as MountNotionQueryParameters<<%= classify(title) %>Index>;
    <% if (options.accessorProperty && options.userColumn) { %>
      const principal = res.locals.principal;
      const principalFilter: QueryFilter<<%= classify(title) %>Index> =
        principal.role === 'client'
          ? { property: '<%= options.userColumn %>', relation: { contains: principal.id } }
          : {
              property: '<%= options.accessorProperty %>',
              rollup: { any: { relation: { contains: principal.<%= options.accessorProperty %> } } },
            };
    <% } else if (options.userColumn) { %>
      const principal = res.locals.principal;
      const principalFilter: QueryFilter<<%= classify(title) %>Index> = { property: '<%= options.userColumn %>', relation: { contains: principal.id } };
    <% } %>
    <% if (options.userColumn) { %>
      const filter = where?.filter
        ? ({
            and: [where.filter, principalFilter],
          } as QueryFilter<<%= classify(title) %>Index>)
        : principalFilter;
    <% } else { %>
      const filter = where?.filter as QueryFilter<<%= classify(title) %>Index>;
    <% } %>

    try {
      const items: <%= classify(title) %>[] = await mn.<%= camelize(title) %>.query({
        ...where,
        filter,
      });
      res.status(200).send(items);
    } catch (e) {
      res.status(500).send({ status: 500, message: e.message });
    }
};

async function getById(req: Request, res: Response) {
  const id = req.params.id;

  try {
    const item: <%= classify(title) %> = await mn.<%= camelize(title) %>.retrieve({ id });

    if (item) {
      return res.status(200).send(item);
    }


    res.status(404).send({ status: 404, message: '<%= title %> not found' });
  } catch (e) {
    res.status(500).send({ status: 500, message: e.message });
  }
}

async function create(req: Request, res: Response) {
  try {
    <% if (options.userColumn) { %>
      const { 
        id: <%= options.userColumn %>,
        <% if (options.accessorProperty) { %>
          <%= options.accessorProperty %>
        <% } %> 
      } = res.locals.principal;
    <% } %>
    const item: Partial<<%= classify(title) %>> = req.body;
    const newItem = await mn.<%= camelize(title) %>.create({
      <% if (options.userColumn) { %>
        id: <%= options.userColumn %>,
        <%= options.userColumn %>: [<%= options.userColumn %>],
      <% } %>
      <% if (options.accessorProperty) { %>
        <%= options.accessorProperty %>: [<%= options.accessorProperty %>],
      <% } %> 
      ...item,
    });

    res.status(201).json(newItem);
  } catch (e) {
    res.status(500).send({ status: 500, message: e.message });
  }
}

async function updateById (req: Request, res: Response) {
  const id = req.params.id;

  try {
    const item: Partial<<%= classify(title) %>> = req.body;

    const updatedItem = await mn.<%= camelize(title) %>.update({
      id,
      ...item,
    });;

    res.status(200).json(updatedItem);
  } catch (e) {
    res.status(500).send({ status: 500, message: e.message });
  }
}

async function deleteById (req: Request, res: Response) {
  try {
    const id = req.params.id;
    const deleted = await mn.<%= camelize(title) %>.delete({ id });

    res.status(204).send(deleted);
  } catch (e) {
    res.status(500).send({ status: 500, message: e.message });
  }
}

export default {
  query,
  create,
  getById,
  updateById,
  deleteById
}