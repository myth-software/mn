import { MountnCommand } from '@mountnotion/types';
import { logSuccess } from '@mountnotion/utils';
import * as open from 'open';

export default {
  name: 'auth-oauth',
  description: 'oauth to notion using the web browser',
  options: [],
  actionFactory: () => async () => {
    logSuccess({ action: 'starting', message: 'auth-oauth command' });
    logSuccess({ action: '--------', message: '------------------' });
    await open('https://www.oauth.com/oauth2-servers/device-flow/');
    const oAuth = 'https://www.oauth.com/oauth2-servers/device-flow/';

    console.log(`opening browser ${oAuth} ...`);
  },
} satisfies MountnCommand;
