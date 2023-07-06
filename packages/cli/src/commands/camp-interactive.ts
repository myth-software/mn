import { MountnCommand } from '@mountnotion/types';
import { log } from '@mountnotion/utils';
import { prompt } from 'enquirer';
import configureLintColumns from './configure-lint-columns';
import configureLintRows from './configure-lint-rows';
import configureSchematics from './configure-schematics';
import configureWorkspace from './configure-workspace';
import fetch from './fetch';
import schematics from './schematics';

export async function optionsPrompt() {
  const results = await prompt<{
    choice: number;
  }>({
    type: 'input',
    message: 'choice',
    name: 'choice',
  });

  return results;
}

export default {
  name: 'camp-interactive',
  description: 'interactive version of camp',
  actionFactory: (config) => async () => {
    console.log('camping...');
    console.log('choose');
    console.log('');
    console.log('1 - configure-workspace');
    console.log('2 - configure-lint-columns');
    console.log('3 - configure-lint-rows');
    console.log('4 - configure-schematics');
    console.log('5 - inspect the entities');
    console.log('6 - inspect the configuration file');
    console.log('7 - fetch and scheme');
    let choice: number;
    const result = await optionsPrompt();
    choice = result.choice;

    while (choice >= 1 && choice <= 7) {
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

      const result = await optionsPrompt();
      choice = result.choice;
    }

    return;
  },
} satisfies MountnCommand;
