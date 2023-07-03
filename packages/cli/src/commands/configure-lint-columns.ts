import { MountnCommand } from '@mountnotion/types';
import { prompt } from 'enquirer';

type ConfigureLintColumnsOptions = {
  use: string;
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
      message: 'select lint rules to use:',
      name: 'use',
      choices: [
        { name: "consistent titles as 'name'" },
        { name: 'automatic created_by' },
        { name: 'automatic created_time' },
        { name: 'automatic last_edited_by' },
        { name: 'automatic last_edited_time' },
        { name: 'consistent select colors using first color' },
        { name: 'consistent multi_select colors using first color' },
        { name: 'lowercase column names' },
        { name: 'relations with leading emoji' },
      ],
    });
  }

  if (prompts.length) {
    const results = await prompt<ConfigureLintColumnsOptions>(prompts);

    return results;
  }

  return;
};

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
  actionFactory: () => async (args) => {
    assert(args);
    const options = await optionsPrompt(args);
    console.log(options);

    return;
  },
} satisfies MountnCommand;
