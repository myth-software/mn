import { MountnCommand } from '@mountnotion/types';

export default {
  name: 'camp',
  description: 'runs a watch command then calls an api on press of keyboard',
  actionFactory: () => async () => {
    return;
  },
} satisfies MountnCommand;
