import { MountnCommand } from '@mountnotion/types';
import { logSuccess } from '@mountnotion/utils';
import { prompt } from 'enquirer';

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
  options: [
    {
      name: '-i, --integration-key <integration-key>',
      description: 'notion integration key',
    },
  ],
  actionFactory: () => async (options) => {
    assert(options);
    logSuccess({ action: 'starting', message: 'auth-integration-key command' });
    logSuccess({ action: '--------', message: '----------------------------' });

    if (!options.integrationKey) {
      await promptAuthIntegrationKey();
      return;
    }

    return;
  },
} satisfies MountnCommand;
