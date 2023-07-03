import { MountnCommand } from '@mountnotion/types';

export default {
  name: 'camp-interactive',
  description: 'interactive version of camp',
  actionFactory: () => async () => {
    return;
  },
} satisfies MountnCommand;
