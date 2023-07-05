import { MountnCommand } from '@mountnotion/types';
import { prompt } from 'enquirer';
import authIntegrationKey from './auth-integration-key';
import authOauth from './auth-oauth';
import selectPagesIntegrationKey from './select-pages-integration-key';

export const authPrompt = async () => {
  const results = await prompt<{
    press: string;
  }>({
    type: 'input',
    message: `
      press any key to launch oauth flow in browser

      press 'i' to use notion integration key auth flow`,
    name: 'press',
  });

  return results;
};

export default {
  name: 'setup',
  description: 'interactive setup for mount notion',
  actionFactory: (config) => async () => {
    const { press } = await authPrompt();

    if (press === 'i') {
      await authIntegrationKey.actionFactory(config)({});
      await selectPagesIntegrationKey.actionFactory(config)({});
    }

    if (press !== 'i') {
      await authOauth.actionFactory()();
    }

    return;
  },
} satisfies MountnCommand;
