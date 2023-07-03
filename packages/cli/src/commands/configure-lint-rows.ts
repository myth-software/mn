import { MountnCommand } from '@mountnotion/types';
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
      message: 'Select lint rules to use:',
      name: 'configureLintRows',
      choices: [
        'lowercase page titles',
        'untitled pages default to animal color names',
        'pages without icons default to database icon',
      ],
    });
  }

  if (prompts.length) {
    const results = await prompt<ConfigureLintRowsOptions>(prompts);

    return results;
  }
  return;
};

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
  actionFactory: () => async (args) => {
    assert(args);
    const options = await optionsPrompt(args);
    console.log(options);

    return;
  },
} satisfies MountnCommand;
