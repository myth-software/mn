import {
  ColumnsLintRules,
  MountnCommand,
  MountNotionConfig,
} from '@mountnotion/types';
import { prompt } from 'enquirer';
import { writeFileSync } from 'fs';
import { CONFIG_FILE } from '../utils';

type ConfigureLintColumnsOptions = {
  use: Array<string>;
};

function assert(
  condition: unknown,
  msg?: string
): asserts condition is ConfigureLintColumnsOptions {
  if (typeof condition !== 'object') {
    throw new Error(msg);
  }
}

export const optionsPrompt = async (options: ConfigureLintColumnsOptions) => {
  const prompts = [];
  if (!options.use) {
    prompts.push({
      type: 'multiselect',
      message: 'select lint rules to use',
      name: 'use',
      choices: [
        { name: "consistent titles as 'name'", hint: '' },
        { name: 'automatic created_by', hint: '' },
        { name: 'automatic created_time', hint: '' },
        { name: 'automatic last_edited_by', hint: '' },
        { name: 'automatic last_edited_time', hint: '' },
        { name: 'consistent select colors using first color', hint: '' },
        { name: 'consistent multi_select colors using first color', hint: '' },
        { name: 'lowercase column names', hint: '' },
        { name: 'relations with leading emoji', hint: '' },
      ],
    });
  }

  if (prompts.length) {
    const results = await prompt<ConfigureLintColumnsOptions>(prompts);

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
  name: 'configure-lint-columns',
  description:
    'configure the lint rules for columns of databases in the workspace',
  options: [
    {
      name: '-u, --use <rule>',
      description: 'select lint rules to use',
    },
  ],
  actionFactory: (config) => async (args) => {
    dependencies(config);
    assert(args);
    const options = await optionsPrompt(args);

    const updatedConfig: MountNotionConfig = {
      ...config,
      workspace: {
        ...config.workspace,
        lint: {
          ...config.workspace.lint,
          columns: options.use?.reduce((acc, column) => {
            return {
              ...acc,
              [column]: column,
            };
          }, {} as Partial<ColumnsLintRules>),
        },
      },
    };

    writeFileSync(CONFIG_FILE, JSON.stringify(updatedConfig));

    return;
  },
} satisfies MountnCommand;
