import {
  MountnCommand,
  MountNotionConfig,
  Schematics,
} from '@mountnotion/types';
import { log } from '@mountnotion/utils';
import { prompt } from 'enquirer';
import { writeFileSync } from 'fs';
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
          name: 'locals',
        },
      ],
    });
  }

  if (!options.exclude) {
    prompts.push({
      type: 'multiselect',
      message: 'databases to exclude from all schematics',
      name: 'exclude',
      choices: [
        {
          name: '🔵 overlays',
          value: 'xxxxssss-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        },
        {
          name: '🔢 sets',
          value: 'xxxxssss-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        },
      ],
    });
  }

  if (prompts.length) {
    const results = await prompt<ConfigureSchematicsOptions>(prompts);

    return results;
  }
  return options;
};

function dependencies(config: MountNotionConfig) {
  const hasPages = config.workspace.selectedPages.length > 0;

  if (!hasPages) {
    throw new Error('no pages selected');
  }
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
      message: 'entities schematic is required, schemed automatially',
    });

    const updatedConfig: MountNotionConfig = {
      ...config,
      schematics: [...config.schematics, ...options.schematics],
    };

    writeFileSync(CONFIG_FILE, JSON.stringify(updatedConfig));

    return;
  },
} satisfies MountnCommand;
