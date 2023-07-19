import {
  <%= classify(title) %>,
  New<%= classify(title) %>,
} from '<%= options.drizzle %>';
import { Request, Response } from 'express';
import { client } from '../mn';
async function query(req: Request, res: Response) {
  const where = req.query.where as any;
  const principal = res.locals.principal;
  const principalFilter =
    principal.role === 'client'
      ? { property: '<% options.userColumn %>', relation: { contains: principal.id } }
      : {
          property: '<% options.accessorProperty %>',
          relation: { contains: principal.<% options.accessorProperty %> },
        };
  const filter = where?.filter
    ? { and: [where.filter, principalFilter] }
    : principalFilter;
  try {
    const items: <%= classify(title) %>[] = await client.<%= camelize(title) %>.query({
      ...where,
      filter,
    });
    res.status(200).send(items);
  } catch (e) {
    res.status(500).send({ status: 500, message: e.message });
  }
}
async function getById(req: Request, res: Response) {
  const item = res.locals.item as <%= classify(title) %>;
  if (item) {
    return res.status(200).send(item);
  }
  res.status(404).send({ status: 404, message: '<%= title %> not found' });
}
async function create(req: Request, res: Response) {
  try {
    const { id: <% options.userColumn %>, <% options.accessorProperty %> } = res.locals.principal;
    const item: New<%= classify(title) %> = req.body;
    const newItem = await client.<%= camelize(title) %>.create({
      <% options.userColumn %>: [<% options.userColumn %>],
      <% options.accessorProperty %>: [<% options.accessorProperty %>],
      ...item,
    });
    res.status(201).json(newItem);
  } catch (e) {
    res.status(500).send({ status: 500, message: e.message });
  }
}
async function updateById(req: Request, res: Response) {
  const id = req.params.id;
  try {
    const item: New<%= classify(title) %> = req.body;
    const updatedItem = await client.<%= camelize(title) %>.update({ id, ...item });
    res.status(200).json(updatedItem);
  } catch (e) {
    res.status(500).send({ status: 500, message: e.message });
  }
}
async function deleteById(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const deleted = await client.<%= camelize(title) %>.delete({ id });
    res.status(204).send(deleted);
  } catch (e) {
    res.status(500).send({ status: 500, message: e.message });
  }
}
export default { query, create, getById, updateById, deleteById };
