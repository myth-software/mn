import { MountnCommand } from '@mountnotion/types';
import { log } from '@mountnotion/utils';
import { prompt } from 'enquirer';
import ensureGitignore from '../utils/ensure-gitignore';
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

type AuthFlowOptions = {
  flow: 'oauth' | 'integration key';
};

export async function authPrompt() {
  const results = await prompt<AuthFlowOptions>({
    type: 'select',
    message: 'select auth flow',
    choices: [
      {
        name: 'oauth',
        hint: 'launch oauth flow in browser',
      },
      {
        name: 'integration key',
        hint: 'use notion integration key auth flow',
      },
    ],
    name: 'flow',
  });

  return results;
}

export default {
  name: 'setup',
  description: 'interactive setup for mount notion',
  actionFactory: (config) => async () => {
    ensureGitignore();

    const { flow } = await authPrompt();

    if (flow === 'integration key') {
      await authIntegrationKey.actionFactory(config)();
      await selectPagesIntegrationKey.actionFactory(config)({});
    }

    if (flow === 'oauth') {
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
    await campInteractive.actionFactory(config)();

    log.info({ action: 'informing', message: 'setup complete' });

    return;
  },
} satisfies MountnCommand;
