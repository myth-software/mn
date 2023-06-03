import { MountnCommand } from '@mountnotion/types';
import { prompt } from 'enquirer';

export type WorkspaceConfig = {
  entities: string | null;
  baseUrl: string | null;
  authStrategies: Array<'notion' | 'sms'> | null;
  usersDatabase: 'people' | 'companies' | 'users' | null;
  userColumn: string | null;
};

function assert(
  condition: unknown,
  msg?: string
): asserts condition is WorkspaceConfig {
  if (typeof condition !== 'object') {
    throw new Error(msg);
  }
}

export const promptConfigureWorkspace = async (
  newConfig: WorkspaceConfig,
  currentConfig: WorkspaceConfig
): Promise<WorkspaceConfig> => {
  // combine these individual xxResults variables into one more complex results variable

  if (newConfig.entities === undefined) {
    const results = await prompt<WorkspaceConfig>([
      {
        type: 'input',
        message: 'name of entities package:',
        name: 'entities',
      },
    ]);
    currentConfig.entities = results.entities;
  } else {
    currentConfig.entities = newConfig.entities;
  }

  if (newConfig.baseUrl === undefined) {
    const results = await prompt<WorkspaceConfig>([
      {
        type: 'input',
        message: 'base url for api:',
        name: 'baseUrl',
      },
    ]);
    currentConfig.baseUrl = results.baseUrl;
  } else {
    currentConfig.baseUrl = newConfig.baseUrl;
  }
  if (newConfig.authStrategies === undefined) {
    const results = await prompt<WorkspaceConfig>([
      {
        type: 'multiselect',
        message: 'authentication strategies:',
        name: 'authStrategies',
        choices: ['notion', 'sms'],
      },
    ]);
    currentConfig.authStrategies = results.authStrategies;
  } else {
    currentConfig.authStrategies = newConfig.authStrategies;
  }
  if (newConfig.usersDatabase === undefined) {
    const results = await prompt<WorkspaceConfig>([
      {
        type: 'list',
        message: 'users database:',
        name: 'usersDatabase',
        choices: ['people', 'companies', 'users'],
      },
    ]);
    currentConfig.usersDatabase = results.usersDatabase;
  } else {
    currentConfig.usersDatabase = newConfig.usersDatabase;
  }
  if (newConfig.userColumn === undefined) {
    const results = await prompt<WorkspaceConfig>([
      {
        type: 'input',
        message: 'user column:',
        name: 'userColumn',
      },
    ]);
    currentConfig.userColumn = results.userColumn;
  } else {
    currentConfig.userColumn = newConfig.userColumn;
  }
  console.log('You selected:', currentConfig);
  return currentConfig;
};

export default {
  name: 'configure-workspace',
  description: '',
  options: [
    {
      name: '-e, --entities [configure-workspace]',
      description: 'name of entities package',
    },
  ],
  actionFactory: () => (options) => {
    assert(options);
    let workspaceConfig: WorkspaceConfig = {
      entities: null,
      baseUrl: null,
      authStrategies: null,
      usersDatabase: null,
      userColumn: null,
    };

    const selectedConfig: WorkspaceConfig = {
      entities: options['entities'],
      baseUrl: options['baseUrl'],
      authStrategies: options['authStrategies'],
      usersDatabase: options['usersDatabase'],
      userColumn: options['userColumn'],
    };

    if (
      options['entities'] &&
      options['baseUrl'] &&
      options['authStrategies'] &&
      options['usersDatabase'] &&
      options['userColumn']
    ) {
      promptConfigureWorkspace(selectedConfig, workspaceConfig);
    } else {
      if (
        options['entities'] === undefined ||
        options['baseUrl'] === undefined ||
        options['authStrategies'] === undefined ||
        options['usersDatabase'] === undefined ||
        options['userColumn'] === undefined
      ) {
        promptConfigureWorkspace(selectedConfig, workspaceConfig);
      } else {
        workspaceConfig = {
          entities: options['entities'],
          baseUrl: options['baseUrl'],
          authStrategies: options['authStrategies'],
          usersDatabase: options['usersDatabase'],
          userColumn: options['userColumn'],
        };
        console.log('You selected:', workspaceConfig);
      }
    }
  },
} satisfies MountnCommand;
