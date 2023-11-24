import { MountnCommand } from '@mountnotion/types';
import { log } from '@mountnotion/utils';
import { prompt } from 'enquirer';
import configureLintColumns from './configure-lint-columns';
import configureLintRows from './configure-lint-rows';
import configureSchematics from './configure-schematics';
import configureWorkspace from './configure-workspace';
import fetch from './fetch';
import schematics from './scheme';

export async function optionsPrompt() {
  const results = await prompt<{
    choice: number;
  }>({
    type: 'numeral',
    message: 'choice',
    name: 'choice',
  });

  return results;
}

export default {
  name: 'camp-interactive',
  description: 'interactive version of camp',
  actionFactory: (config) => async () => {
    let choice: number = 1;

    while (choice >= 1 && choice <= 7) {
      log.info({
        action: 'camping',
        message: 'chooose',
      });
      log.info({
        action: '',
        message: '1 - configure-workspace',
      });
      log.info({
        action: '',
        message: '2 - configure-lint-columns',
      });
      log.info({
        action: '',
        message: '3 - configure-lint-rows',
      });
      log.info({
        action: '',
        message: '4 - configure-schematics',
      });
      log.info({
        action: '',
        message: '5 - inspect the schema',
      });
      log.info({
        action: '',
        message: '6 - inspect the configuration file',
      });
      log.info({
        action: '',
        message: '7 - fetch and scheme',
      });

      const result = await optionsPrompt();
      choice = result.choice;
      if (choice === 1) {
        await configureWorkspace.actionFactory(config)({});
      }

      if (choice === 2) {
        await configureLintColumns.actionFactory(config)({});
      }

      if (choice === 3) {
        await configureLintRows.actionFactory(config)({});
      }

      if (choice === 4) {
        await configureSchematics.actionFactory(config)({});
      }

      if (choice === 5) {
        log.error({ action: 'erroring', message: 'not implemented' });
      }

      if (choice === 6) {
        log.error({ action: 'erroring', message: 'not implemented' });
      }

      if (choice === 7) {
        await fetch.actionFactory(config)();
        await schematics.actionFactory(config)({});
      }
    }

    return;
  },
} satisfies MountnCommand;
