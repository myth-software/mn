import { MountnCommand } from '@mountnotion/types';
import { prompt } from 'enquirer';

type AuthIntegrationKeyOptions = {
  integrationKey: string;
};

async function optionsPrompt() {
  const results = await prompt<AuthIntegrationKeyOptions>([
    {
      type: 'input',
      message: 'integration key:',
      name: 'integrationKey',
    },
  ]);

  return results;
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
      name: '-i, --integration-key <integration-key>',
      description: 'notion integration key',
    },
  ],
  actionFactory: () => async (options) => {
    assert(options);

    if (!options.integrationKey) {
      await optionsPrompt();
      return;
    }

    return;
  },
} satisfies MountnCommand;
