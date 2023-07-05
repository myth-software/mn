import { MountnCommand } from '@mountnotion/types';
import { log } from '@mountnotion/utils';
import * as express from 'express';
import * as open from 'open';

export default {
  name: 'auth-oauth',
  description: 'oauth to notion using the web browser',
  options: [],
  actionFactory: () => async () => {
    const app = express();
    let resolve: (code: string) => void;
    const p = new Promise((_resolve) => {
      resolve = _resolve;
    });
    app.get('/oauth', function (req, res) {
      // Will print the OAuth auth code
      resolve(req.query['code'] as string);

      res.end('');
    });
    const server = app.listen(3000);

    const clientId = 'OMITTED';
    const owner = 'OMITTED';

    const redirect = encodeURIComponent('http://localhost:3000/oauth');
    await open(
      `https://api.notion.com/v1/oauth/authorize?owner=${owner}&client_id=${clientId}&redirect_uri=${redirect}&response_type=code`
    );
    const code = await p;
    server.close();
    const res = await fetch(
      `https://api.notion.com/v1/oauth/token?code=${code}`
    );
    console.log(res.body);

    const oAuth = 'https://www.oauth.com/oauth2-servers/device-flow/';
    log.success({ action: 'opening', message: `browser ${oAuth} ...` });
  },
} satisfies MountnCommand;
