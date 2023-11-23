import { MountnCommand } from '@mountnotion/types';
import { log } from '@mountnotion/utils';
import { prompt } from 'enquirer';
import { CONFIG_FILE } from '../utils';
import ensureGitignore from '../utils/ensure-gitignore';
import ensureMnJson from '../utils/ensure-mn-json';
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
import schematics from './scheme';
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
  actionFactory: () => async () => {
    ensureGitignore();
    let config = ensureMnJson(CONFIG_FILE);

    const { flow } = await authPrompt();

    if (flow === 'integration key') {
      config = ensureMnJson(CONFIG_FILE);
      await authIntegrationKey.actionFactory(config)();
      await selectPagesIntegrationKey.actionFactory(config)({});
    }

    if (flow === 'oauth') {
      config = ensureMnJson(CONFIG_FILE);
      await authOauth.actionFactory()();
      await selectPagesOauth.actionFactory(config)();
    }

    config = ensureMnJson(CONFIG_FILE);
    await fetch.actionFactory(config)();
    config = ensureMnJson(CONFIG_FILE);
    await configureWorkspace.actionFactory(config)({});
    config = ensureMnJson(CONFIG_FILE);
    await configureLintColumns.actionFactory(config)({});
    config = ensureMnJson(CONFIG_FILE);

    if (Object.keys(config.lint).includes('column-')) {
      await lintColumns.actionFactory(config)({});
      config = ensureMnJson(CONFIG_FILE);
      await fixColumns.actionFactory()({});
    }

    config = ensureMnJson(CONFIG_FILE);
    await configureLintRows.actionFactory(config)({});
    config = ensureMnJson(CONFIG_FILE);

    if (Object.keys(config.lint).includes('row-')) {
      await lintRows.actionFactory(config)({});
      config = ensureMnJson(CONFIG_FILE);
      await fixRows.actionFactory()({});
    }

    config = ensureMnJson(CONFIG_FILE);
    await configureSchematics.actionFactory(config)({});
    config = ensureMnJson(CONFIG_FILE);
    await schematics.actionFactory(config)({});
    config = ensureMnJson(CONFIG_FILE);
    await campInteractive.actionFactory(config)();

    log.info({ action: 'informing', message: 'setup complete' });

    return;
  },
} satisfies MountnCommand;
