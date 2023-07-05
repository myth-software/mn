import { MountnCommand, MountNotionConfig } from '@mountnotion/types';
import { logError } from '@mountnotion/utils';
import { prompt } from 'enquirer';
import { writeFileSync } from 'fs';
import { CONFIG_FILE } from '../utils';

export type WorkspaceOptions = {
  entities: string | null;
  baseUrl: string | null;
  authStrategies: Array<'email' | 'sms'> | null;
  usersDatabase: 'people' | 'companies' | 'users' | null;
  userColumn: string | null;
};

function assert(
  condition: unknown,
  msg?: string
): asserts condition is WorkspaceOptions {
  if (typeof condition !== 'object') {
    throw new Error(msg);
  }
}

function dependencies() {
  const cache = [];
  const hasCache = cache.length > 1;
  if (!hasCache) {
    logError({
      action: 'erroring',
      message: 'missing mount notion cache',
    });
    throw new Error('missing mount notion cache');
  }
}

export async function optionsPrompt(options: WorkspaceOptions) {
  const prompts = [];

  if (!options.entities) {
    prompts.push({
      type: 'input',
      message: 'name of entities package:',
      name: 'entities',
    });
  }

  if (!options.baseUrl) {
    prompts.push({
      type: 'input',
      message: 'base url for api:',
      name: 'baseUrl',
    });
  }

  if (!options.authStrategies) {
    prompts.push({
      type: 'multiselect',
      message: 'authentication strategies:',
      name: 'authStrategies',
      choices: ['email', 'sms'],
    });
  }

  if (!options.usersDatabase) {
    prompts.push({
      type: 'list',
      message: 'users database:',
      name: 'usersDatabase',
      choices: ['people', 'companies', 'users'],
    });
  }

  if (!options.userColumn) {
    prompts.push({
      type: 'input',
      message: 'user column:',
      name: 'userColumn',
    });
  }

  if (prompts.length) {
    const results = await prompt<WorkspaceOptions>(prompts);
    return { ...options, ...results };
  }
  return options;
}

export default {
  name: 'configure-workspace',
  description: 'configures mount notion workspace',
  options: [
    {
      name: '-e, --entities [name]',
      description: 'name of entities package',
    },
    {
      name: '-b, --base-url [url]',
      description: 'base url for api',
    },
    {
      name: '-a, --auth-strategies [strategy]',
      description: 'authentication strategy',
    },
    {
      name: '-d, --users-database [name]',
      description: 'users database',
    },
    {
      name: '-c, --user-colum [name]',
      description: 'user column',
    },
  ],
  actionFactory: (config) => async (args) => {
    assert(args);
    dependencies();
    const options = await optionsPrompt(args);
    const updatedConfig: MountNotionConfig = {
      ...config,
      options: {
        ...config.options,
        basic: {
          ...config.options.basic,
          entities: options.entities ?? config.options.basic.entities,
          baseUrl: options.baseUrl ?? config.options.basic.baseUrl,
        },
        auth: {
          ...config.options.auth,
          strategies: options.authStrategies ?? config.options.auth.strategies,
          userColumn: options.userColumn ?? config.options.auth.userColumn,
          usersDatabase:
            options.usersDatabase ?? config.options.auth.usersDatabase,
        },
      },
    };

    writeFileSync(CONFIG_FILE, JSON.stringify(updatedConfig));

    return;
  },
} satisfies MountnCommand;
