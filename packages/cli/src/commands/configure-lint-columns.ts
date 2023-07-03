import { MountnCommand } from '@mountnotion/types';
import { prompt } from 'enquirer';

type ColumnsOptions = {
  configureLintColumns: string[];
  use: string;
};

function assert(
  condition: unknown,
  msg?: string
): asserts condition is ColumnsOptions {
  if (typeof condition !== 'object') {
    throw new Error(msg);
  }
}

export const optionsPrompt = async () => {
  const results = await prompt<ColumnsOptions>([
    {
      type: 'multiselect',
      message: 'select lint rules to use:',
      name: 'configureLintColumns',
      choices: [
        "consistent titles as 'name'",
        'automatic created_by',
        'automatic created_time',
        'automatic last_edited_by',
        'automatic last_edited_time',
        'consistent select colors using first color',
        'consistent multi_select colors using first color',
        'lowercase column names',
        'relations with leading emoji',
      ],
    },
  ]);

  return results;
};

export default {
  name: 'configure-lint-columns',
  description:
    'configure the lint rules for columns of databases in the workspace',
  options: [
    {
      name: '-u, --use [configure-lint-columns]',
      description: 'select lint rules to use',
    },
  ],
  actionFactory: () => async (options) => {
    assert(options);
    if (!options['use']) {
      await optionsPrompt();
      return;
    }

    return;
  },
} satisfies MountnCommand;
