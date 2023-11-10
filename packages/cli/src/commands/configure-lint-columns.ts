import {
  ColumnsLintRules,
  MountnCommand,
  MountNotionConfig,
} from '@mountnotion/types';
import { writeFileWithPrettyJson } from '@mountnotion/utils';
import { prompt } from 'enquirer';
import { COLUMNS_LINT_RULES, CONFIG_FILE } from '../utils';

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
      choices: COLUMNS_LINT_RULES.map((rule) => {
        return {
          name: rule.name,
          value: rule.id,
          hint: rule.description ?? '',
        };
      }),
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

    writeFileWithPrettyJson(CONFIG_FILE, updatedConfig);

    return;
  },
} satisfies MountnCommand;
