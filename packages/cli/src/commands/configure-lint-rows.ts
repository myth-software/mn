import { MountnCommand } from '@mountnotion/types';
import { prompt } from 'enquirer';

type RowsOptions = {
  configureStandardsRows: string[];
  use: string;
};

function assert(
  condition: unknown,
  msg?: string
): asserts condition is RowsOptions {
  if (typeof condition !== 'object') {
    throw new Error(msg);
  }
}

export const rowConfigChoices = [
  'lowercase page titles',
  'untitled pages default to animal color names',
  'pages without icons default to database icon',
];

export const promptStandardsRows = async () => {
  const results = await prompt<RowsOptions>([
    {
      type: 'multiselect',
      message: 'Select lint rules to use:',
      name: 'configureStandardsRows',
      choices: rowConfigChoices,
    },
  ]);
  console.log('You selected:', results.configureStandardsRows);
  const selectedRowConfig = results.configureStandardsRows;
  console.log('selectedRowConfig:', selectedRowConfig);
  return results.configureStandardsRows;
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
      await promptStandardsRows();
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
