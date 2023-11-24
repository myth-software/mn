import { MountnCommand, MountNotionConfig } from '@mountnotion/types';
import {
  ensure,
  getSchema,
  log,
  writeFileWithPrettyJson,
} from '@mountnotion/utils';
import { prompt } from 'enquirer';
import { CONFIG_FILE } from '../utils';

export type WorkspaceOptions = {
  schema: string | null;
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
  const schema = getSchema();
  const hasSchema = schema !== undefined && schema.length > 1;
  if (!hasSchema) {
    log.fatal({
      action: 'aborting',
      message: 'missing mount notion schema',
    });
  }
}

export async function optionsPrompt(options: WorkspaceOptions) {
  const prompts = [];
  const schema = ensure(getSchema());

  if (!options.schema) {
    prompts.push({
      type: 'input',
      message: 'name of schema package',
      name: 'schema',
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
      choices: schema.map((c) => {
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
        schema.find((c) => c.title === results.usersDatabase)
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
      name: '-c, --schema [name]',
      description: 'name of schema package',
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
      schematicDefaults: {
        ...config.schematicDefaults,
        schema: options.schema ?? config.schematicDefaults?.schema,
        baseUrl: options.baseUrl ?? config.schematicDefaults?.baseUrl,
        strategies:
          options.authStrategies ?? config.schematicDefaults?.strategies,
        userColumn: options.userColumn ?? config.schematicDefaults?.userColumn,
      },
    };

    writeFileWithPrettyJson(CONFIG_FILE, updatedConfig);

    return;
  },
} satisfies MountnCommand;
