<% if (options.debug) { %>
  <%= log.debug({ action: 'debugging', message: `index: titles ${titles ? 'are defined': 'are not defined'}` }) %>
<% } %>

import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import * as path from 'path';

<% for(const title of titles) { %>
  import { <%= camelize(title) %>Router } from './routers/<%= dasherize(title) %>.router';
<% } %>




const PORT: number = process.env.PORT ? parseInt(process.env.PORT as string, 10): 3000;
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use((err, req, res, next) => {
  if (!err) {
    next();
  }

  console.error(err.stack);
  res.status(err.status).json({ message: err.message });
});

<% for(const title of titles) { %>
  app.use('/<%= dasherize(title) %>', <%= camelize(title) %>Router);
  import * from './routers/<%= dasherize(title) %>.router';
<% } %>

const server = app.listen(PORT, () => {
  console.log(`listening at http://localhost:${PORT}`);
});

server.on('error', console.error);
