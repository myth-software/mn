import { MountnCommand } from '@mountnotion/types';

export default {
  name: 'setup',
  description: 'interactive setup for mount notion',
  actionFactory: () => async () => {
    return;
  },
} satisfies MountnCommand;
