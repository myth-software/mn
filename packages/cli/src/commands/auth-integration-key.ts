import { MountnCommand, MountNotionConfig } from '@mountnotion/types';
import { log, writeFileWithPrettyJson } from '@mountnotion/utils';
import { CONFIG_FILE } from '../utils';

export default {
  name: 'auth-integration-key',
  description:
    'an integration key generated in notion by a developer for internal integrations',

  actionFactory: (config) => async () => {
    const updatedConfig: MountNotionConfig = {
      ...config,
      auth: 'key',
    };

    writeFileWithPrettyJson(CONFIG_FILE, updatedConfig);

    log.success({ action: 'writing', message: 'auth method is key' });
    return;
  },
} satisfies MountnCommand;
