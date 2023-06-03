<% if (debug) { %>
  <%= logDebug({ action: 'debugging', message: `router: title ${title ? 'is ' + title : 'is not defined'}` }) %>
<% } %>

import express, { Request, Response } from 'express';
import { 
  <%= classify(title) %>,
  <%= classify(title) %>Writeonly,
  <%= classify(title) %>Index,
  <%= underscore(title).toUpperCase() %>,
  indicies 
} from '<%= entities %>';
import {
    configure
} from '@mountnotion/sdk';

const mn = configure({
  integrationKey: process.env.INTEGRATION_KEY!,
  indicies
});

export const <%= camelize(title) %>Router = express.Router();

<%= camelize(title) %>Router.get('/', async (req: Request, res: Response) => {
  cons where = req.query.where as MountNotionQueryParameters<<%= classify(title) %>Index>;
  try {
    const <%= camelize(title) %>: <%= classify(title) %>[] = await mn.<%= camelize(title) %>.query(where);
    

    res.status(200).send(<%= camelize(title) %>);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

<%= camelize(title) %>Router.get('/:id', async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);

  try {
    const item: <%= classify(title) %> = await mn.<%= camelize(title) %>.retrieve({ id });

    if (item) {
      return res.status(200).send(item);
    }

    res.status(404).send('item not found');
  } catch (e) {
    res.status(500).send(e.message);
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

    const new<%= classify(title) %> = await mn.<%= camelize(title) %>.create({
      name,
      ...body,
    });

    res.status(201).json(new<%= classify(title) %>);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

<%= camelize(title) %>Router.patch('/:id', async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);

  try {
    const itemUpdate: Partial<<%= classify(title) %>Writeonly> = req.body;

    const updated<%= classify(title) %> = mn.<%= camelize(title) %>.update({
      id,
      ...body,
    });;

    res.status(200).json(updated<%= classify(title) %>);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

<%= camelize(title) %>Router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id, 10);
    const deleted = await mn.delete({ id });

    res.status(204).send(deleted);
  } catch (e) {
    res.status(500).send(e.message);
  }
});