import { MountnCommand } from '@mountnotion/types';
import { prompt } from 'enquirer';

type ConfigureLintRowsOptions = {
  configureLintRows: string[];
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

export const optionsPrompt = async () => {
  const results = await prompt<ConfigureLintRowsOptions>([
    {
      type: 'multiselect',
      message: 'Select lint rules to use:',
      name: 'configureLintRows',
      choices: [
        'lowercase page titles',
        'untitled pages default to animal color names',
        'pages without icons default to database icon',
      ],
    },
  ]);

  return results;
};

export default {
  name: 'configure-lint-rows',
  description:
    'configure the lint rules for rows of databases in the workspace',
  options: [
    {
      name: '-u, --use [configure-lint-rows]',
      description: 'select lint rules to use',
    },
  ],
  actionFactory: () => async (options) => {
    assert(options);
    let selectedRowConfig: string[] | [] = [];
    const args = {} as Record<string, string>;

    if (!options['use']) {
      await optionsPrompt();
      return;
    }

    const selected: string[] = [];
    for (const [index, arg] of Object.entries(args)) {
      if (arg === 'configure-lint-rows') {
        if (args[index + 1] === '-u' || args[index + 1] === '--use') {
          selected.push(args[index + 2]);
        }
      }
    }
    selectedRowConfig = selected;
    console.log(`you have selected a row configuration of: '${selected}'`);
    // console.log("selectedRowConfig", selectedRowConfig);
    return;
  },
} satisfies MountnCommand;
