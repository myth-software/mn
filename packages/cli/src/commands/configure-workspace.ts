import { MountnCommand, MountNotionConfig } from '@mountnotion/types';
import {
  ensure,
  getCache,
  log,
  writeFileWithPrettyJson,
} from '@mountnotion/utils';
import { prompt } from 'enquirer';
import { CONFIG_FILE } from '../utils';

export type WorkspaceOptions = {
  caches: string | null;
  baseUrl: string | null;
  authStrategies: Array<'email' | 'sms'> | null;
  usersDatabase: string | null;
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
  const cache = getCache();
  const hasCache = cache !== undefined && cache.length > 1;
  if (!hasCache) {
    log.fatal({
      action: 'aborting',
      message: 'missing mount notion cache',
    });
  }
}

export async function optionsPrompt(options: WorkspaceOptions) {
  const prompts = [];
  const cache = ensure(getCache());

  if (!options.caches) {
    prompts.push({
      type: 'input',
      message: 'name of caches package',
      name: 'caches',
    });
  }

  if (!options.baseUrl) {
    prompts.push({
      type: 'input',
      message: 'base url for api',
      name: 'baseUrl',
    });
  }

  if (!options.authStrategies) {
    prompts.push({
      type: 'multiselect',
      message: 'authentication strategies',
      name: 'authStrategies',
      choices: ['email', 'sms'],
    });
  }

  if (!options.usersDatabase) {
    prompts.push({
      type: 'select',
      message: 'users database',
      name: 'usersDatabase',
      choices: cache.map((c) => {
        return {
          name: c.title,
          value: c.title,
        };
      }),
    });
  }

  if (prompts.length) {
    const results = await prompt<WorkspaceOptions>(prompts);
    let userColunn;
    if (results.usersDatabase && !options.userColumn) {
      const database = ensure(
        cache.find((c) => c.title === results.usersDatabase)
      );
      const choices = Object.keys(database.columns);
      const result = await prompt<{ userColumn: string }>([
        {
          type: 'select',
          message: 'user column',
          name: 'userColumn',
          choices: choices,
        },
      ]);
      userColunn = result.userColumn;
    }

    return {
      ...options,
      ...results,
      userColunn: userColunn ?? options.userColumn ?? results.userColumn,
    };
  }
  return options;
}

export default {
  name: 'configure-workspace',
  description: 'configures mount notion workspace',
  options: [
    {
      name: '-a, --auth-strategies [strategy]',
      description: 'authentication strategy',
    },
    {
      name: '-b, --base-url [url]',
      description: 'base url for api',
    },
    {
      name: '-d, --users-database [name]',
      description: 'users database',
    },
    {
      name: '-c, --caches [name]',
      description: 'name of caches package',
    },
    {
      name: '-u, --user-colum [name]',
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
          caches: options.caches ?? config.options.basic.caches,
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

    writeFileWithPrettyJson(CONFIG_FILE, updatedConfig);

    return;
  },
} satisfies MountnCommand;
