import { MountnCommand, MountNotionConfig } from '@mountnotion/types';
import { prompt } from 'enquirer';

type ConfigureLintRowsOptions = {
  use: string;
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
      message: 'select lint rules to use:',
      name: 'use',
      choices: [
        { name: 'lowercase page titles' },
        { name: 'untitled pages default to animal color names' },
        { name: 'pages without icons default to database icon' },
      ],
    });
  }

  if (prompts.length) {
    const results = await prompt<ConfigureLintRowsOptions>(prompts);

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
    console.log(options);

    return;
  },
} satisfies MountnCommand;
