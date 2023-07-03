<% if (options.debug) { %>
  <%= logDebug({ action: 'debugging', message: `router: title ${title ? 'is ' + title : 'is not defined'}` }) %>
<% } %>

import express, { Request, Response } from 'express';
import { 
  <%= classify(title) %>,
  <%= classify(title) %>Writeonly,
  <%= classify(title) %>Index,
  <%= underscore(title).toUpperCase() %>
} from '<%= options.entities %>';
import { MountNotionQueryParameters } from '@mountnotion/types';
import { animals, colors, uniqueNamesGenerator } from 'unique-names-generator';
import { mn } from '../mn';

export const <%= camelize(title) %>Router = express.Router();

<%= camelize(title) %>Router.get('/', async (req: Request, res: Response) => {
  const where = req.query.where as MountNotionQueryParameters<<%= classify(title) %>Index>;
  try {
    const items: <%= classify(title) %>[] = await mn.<%= camelize(title) %>.query(where);
    
    res.status(200).send(items);
  } catch (e) {
    res.status(500).send({ status: 500, message: e.message });
  }
});

<%= camelize(title) %>Router.get('/:id', async (req: Request, res: Response) => {
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
});

<%= camelize(title) %>Router.post('/', async (req: Request, res: Response) => {
  try {
    const item: Partial<<%= classify(title) %>Writeonly> = req.body;
    const name = uniqueNamesGenerator({
      dictionaries: [animals, colors],
      separator: '-',
      length: 2,
    });

    const newItem = await mn.<%= camelize(title) %>.create({
      name,
      ...item,
    });

    res.status(201).json(newItem);
  } catch (e) {
    res.status(500).send({ status: 500, message: e.message });
  }
});

<%= camelize(title) %>Router.patch('/:id', async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const item: Partial<<%= classify(title) %>Writeonly> = req.body;

    const updatedItem = mn.<%= camelize(title) %>.update({
      id,
      ...item,
    });;

    res.status(200).json(updatedItem);
  } catch (e) {
    res.status(500).send({ status: 500, message: e.message });
  }
});

<%= camelize(title) %>Router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const deleted = await mn.<%= camelize(title) %>.delete({ id });

    res.status(204).send(deleted);
  } catch (e) {
    res.status(500).send({ status: 500, message: e.message });
  }
});
