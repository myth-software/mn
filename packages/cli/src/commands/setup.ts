import { MountnCommand } from '@mountnotion/types';
import { log } from '@mountnotion/utils';
import { prompt } from 'enquirer';
import authIntegrationKey from './auth-integration-key';
import authOauth from './auth-oauth';
import campInteractive from './camp-interactive';
import configureLintColumns from './configure-lint-columns';
import configureLintRows from './configure-lint-rows';
import configureSchematics from './configure-schematics';
import configureWorkspace from './configure-workspace';
import fetch from './fetch';
import fixColumns from './fix-columns';
import fixRows from './fix-rows';
import lintColumns from './lint-columns';
import lintRows from './lint-rows';
import schematics from './schematics';
import selectPagesIntegrationKey from './select-pages-integration-key';
import selectPagesOauth from './select-pages-oauth';

export const authPrompt = async () => {
  const results = await prompt<{
    press: string;
  }>({
    type: 'input',
    message:
      "press any key to launch oauth flow in browser\n\npress 'i' to use notion integration key auth flow",
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
      await selectPagesOauth.actionFactory(config)();
    }

    await fetch.actionFactory(config)();
    await configureWorkspace.actionFactory(config)({});
    await configureLintColumns.actionFactory(config)({});
    await configureLintRows.actionFactory(config)({});
    await lintColumns.actionFactory(config)({});
    await lintRows.actionFactory(config)({});
    await fixColumns.actionFactory()({});
    await fixRows.actionFactory()({});
    await configureSchematics.actionFactory(config)({});
    await schematics.actionFactory(config)({});
    await campInteractive.actionFactory()();

    log.info({ action: 'informing', message: 'setup complete' });

    return;
  },
} satisfies MountnCommand;
