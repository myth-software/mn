import { prompt } from 'enquirer';
import { MountnCommand } from '../types';

type AuthIntegrationKeyConfig = {
  integrationKey: string;
};

async function promptAuthIntegrationKey(): Promise<string> {
  const results = await prompt<AuthIntegrationKeyConfig>([
    {
      type: 'input',
      message: 'integration key:',
      name: 'integrationKey',
    },
  ]);

  return results.integrationKey;
}

function assert(
  condition: unknown,
  msg?: string
): asserts condition is AuthIntegrationKeyConfig {
  if (typeof condition !== 'object') {
    throw new Error(msg);
  }
}

export default {
  name: 'auth-integration-key',
  description:
    'an integration key generated in notion by a developer for internal integrations',
  actionFactory: () => async (options) => {
    assert(options);
    console.log({ options });

    const integrationKey =
      typeof options.integrationKey === 'string'
        ? options.integrationKey
        : await promptAuthIntegrationKey();

    console.log(integrationKey);
  },
  options: [
    {
      name: '-i, --integration-key <integration-key>',
      description: 'notion integration key',
    },
  ],
} satisfies MountnCommand;
