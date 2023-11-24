import {
  MountnCommand,
  MountNotionConfig,
  Schematics,
} from '@mountnotion/types';
import {
  ensure,
  getSchema,
  log,
  writeFileWithPrettyJson,
} from '@mountnotion/utils';
import { prompt } from 'enquirer';
import { workspaceHasPages } from '../dependencies';
import { CONFIG_FILE } from '../utils';

type ConfigureSchematicsOptions = {
  schematics: Array<Schematics>;
  exclude: Array<string>;
};

function assert(
  condition: unknown,
  msg?: string
): asserts condition is ConfigureSchematicsOptions {
  if (typeof condition !== 'object') {
    throw new Error(msg);
  }
}

export const optionsPrompt = async (options: ConfigureSchematicsOptions) => {
  const prompts = [];
  if (!options.schematics) {
    prompts.push({
      type: 'multiselect',
      message: 'schematics to scheme',
      name: 'schematics',
      choices: [
        {
          name: 'controllers',
        },
        {
          name: 'interfaces',
        },
        {
          name: 'mirage',
        },
        {
          name: 'react-query',
        },
        {
          name: 'rtk-query',
        },
        {
          name: 'fixtures',
        },
      ],
    });
  }

  if (!options.exclude) {
    const schemad = getSchema();
    prompts.push({
      type: 'multiselect',
      message: 'databases to exclude from all schematics',
      name: 'exclude',
      choices: ensure(schemad).map((schema) => ({
        name: `${schema.icon} ${schema.title}`,
        value: schema.id,
      })),
    });
  }

  if (prompts.length) {
    const results = await prompt<ConfigureSchematicsOptions>(prompts);

    return results;
  }
  return options;
};

function dependencies(config: MountNotionConfig) {
  workspaceHasPages(config);
}

export default {
  name: 'configure-schematics',
  description: 'configures schematics to apply in configuration',
  options: [
    {
      name: '-s, --schematics <schematic>',
      description: 'schematics to scheme',
    },
    {
      name: '-e, --exclude-all <exclude>',
      description: 'databases to exclude from all schematics',
    },
  ],
  actionFactory: (config) => async (args) => {
    dependencies(config);
    assert(args);
    const options = await optionsPrompt(args);
    log.info({
      action: 'informing',
      message: 'schema schematic is required, schemed automatially',
    });

    const updatedConfig: MountNotionConfig = {
      ...config,
      schematicDefaults: {
        ...config.schematicDefaults,
        excludes: options.exclude,
      },
      schematics: config.schematics
        ? [...config.schematics, ...options.schematics]
        : options.schematics,
    };

    writeFileWithPrettyJson(CONFIG_FILE, updatedConfig);

    return;
  },
} satisfies MountnCommand;
