import { MountnCommand } from '@mountnotion/types';
import { prompt } from 'enquirer';

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
  actionFactory: () => async (args) => {
    assert(args);
    const options = await optionsPrompt(args);
    console.log(options);

    return;
  },
} satisfies MountnCommand;
