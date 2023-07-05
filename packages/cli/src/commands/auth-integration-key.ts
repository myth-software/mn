import { MountnCommand, MountNotionConfig } from '@mountnotion/types';
import { log } from '@mountnotion/utils';
import { prompt } from 'enquirer';
import { writeFileSync } from 'fs';
import { CONFIG_FILE } from '../utils';

type AuthIntegrationKeyOptions = {
  integrationKey: string;
};

async function optionsPrompt(options: AuthIntegrationKeyOptions) {
  const prompts = [];
  if (!options.integrationKey) {
    prompts.push({
      type: 'input',
      message: 'integration key:',
      name: 'integrationKey',
    });
  }

  if (prompts.length) {
    const results = await prompt<AuthIntegrationKeyOptions>(prompts);

    return results;
  }
  return options;
}

function assert(
  condition: unknown,
  msg?: string
): asserts condition is AuthIntegrationKeyOptions {
  if (typeof condition !== 'object') {
    throw new Error(msg);
  }
}

export default {
  name: 'auth-integration-key',
  description:
    'an integration key generated in notion by a developer for internal integrations',
  options: [
    {
      name: '-i, --integration-key <key>',
      description: 'notion integration key',
    },
  ],
  actionFactory: (config) => async (args) => {
    assert(args);
    const options = await optionsPrompt(args);

    const updatedConfig: MountNotionConfig = {
      ...config,
      auth: {
        ...config.auth,
        key: options.integrationKey,
      },
    };

    writeFileSync(CONFIG_FILE, JSON.stringify(updatedConfig));

    log.success({ action: 'writing', message: 'auth key written to config' });
    return;
  },
} satisfies MountnCommand;
