import { MountnCommand } from '@mountnotion/types';

export default {
  name: 'configure-schematics',
  description: 'configures schematics to apply in configuration',
  actionFactory: () => async () => {
    return;
  },
} satisfies MountnCommand;
