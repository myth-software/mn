import * as open from 'open';
import { MountnCommand } from '../types';

export default {
  name: 'auth-oauth',
  description: 'oauth to notion using the web browser',
  options: [],
  actionFactory: () => async () => {
    await open('https://www.oauth.com/oauth2-servers/device-flow/');
    const oAuth = 'https://www.oauth.com/oauth2-servers/device-flow/';

    console.log(`opening browser ${oAuth} ...`);
  },
} satisfies MountnCommand;
