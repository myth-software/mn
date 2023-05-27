import { MountnCommand } from '@mountnotion/types';
import { prompt } from 'enquirer';

type RowsConfig = {
  configureStandardsRows: string[];
  use: string;
};

function assert(
  condition: unknown,
  msg?: string
): asserts condition is RowsConfig {
  if (typeof condition !== 'object') {
    throw new Error(msg);
  }
}

export const rowConfigChoices = [
  'lowercase page titles',
  'untitled pages default to animal color names',
  'pages without icons default to database icon',
];

export const promptStandardsRows = async (): Promise<string[]> => {
  const results = await prompt<RowsConfig>([
    {
      type: 'multiselect',
      message: 'Select standards to use:',
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
  name: 'configure-standards-rows',
  description: 'configure the standards for rows of databases in the workspace',
  options: [
    {
      name: '-u, --use [configure-standards-rows]',
      description: 'select standards to use',
    },
  ],
  actionFactory: () => (options) => {
    assert(options);
    let selectedRowConfig: string[] | [] = [];
    const args = {} as Record<string, string>;

    if (typeof options.use === 'string') {
      return;
    }

    if (options['use'] === undefined) {
      promptStandardsRows();
    }

    const selected: string[] = [];
    for (const [index, arg] of Object.entries(args)) {
      if (arg === 'configure-standards-rows') {
        if (args[index + 1] === '-u' || args[index + 1] === '--use') {
          selected.push(args[index + 2]);
        }
      }
    }
    selectedRowConfig = selected;
    console.log(`you have selected a row configuration of: '${selected}'`);
    // console.log("selectedRowConfig", selectedRowConfig);
  },
} satisfies MountnCommand;
