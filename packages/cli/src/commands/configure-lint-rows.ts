import { MountnCommand, MountNotionConfig } from '@mountnotion/types';
import { writeFileWithPrettyJson } from '@mountnotion/utils';
import { prompt } from 'enquirer';
import { CONFIG_FILE, ROWS_LINT_RULES } from '../utils';

type ConfigureLintRowsOptions = {
  use: Array<string>;
};

function assert(
  condition: unknown,
  msg?: string
): asserts condition is ConfigureLintRowsOptions {
  if (typeof condition !== 'object') {
    throw new Error(msg);
  }
}

export const optionsPrompt = async (options: ConfigureLintRowsOptions) => {
  const prompts = [];
  if (!options.use) {
    prompts.push({
      type: 'multiselect',
      message: 'select lint rules to use',
      name: 'use',
      choices: ROWS_LINT_RULES.map((rule) => {
        return {
          name: rule.id,
          hint: rule.description ?? '',
        };
      }),
    });
  }

  if (prompts.length) {
    const results = await prompt<ConfigureLintRowsOptions>(prompts);

    return results;
  }
  return options;
};

function dependencies(config: MountNotionConfig) {
  const hasPages = config.selectedPages.length > 0;

  if (!hasPages) {
    throw new Error('no pages selected');
  }
}

export default {
  name: 'configure-lint-rows',
  description:
    'configure the lint rules for rows of databases in the workspace',
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
      lint: {
        ...config.lint,
        ...options.use?.reduce((acc, row) => {
          return {
            ...acc,
            [row]: 'warn',
          };
        }, {}),
      },
    };

    writeFileWithPrettyJson(CONFIG_FILE, updatedConfig);

    return;
  },
} satisfies MountnCommand;
