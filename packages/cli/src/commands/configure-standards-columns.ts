import { prompt } from 'enquirer';
import { MountnCommand } from '../types';

type ColumnsConfig = {
  configureStandardsColumns: string[];
  use: string;
};

function assert(
  condition: unknown,
  msg?: string
): asserts condition is ColumnsConfig {
  if (typeof condition !== 'object') {
    throw new Error(msg);
  }
}

export const columnConfigChoices = [
  "consistent titles as 'name'",
  'automatic created_by',
  'automatic created_time',
  'automatic last_edited_by',
  'automatic last_edited_time',
  'consistent select colors using first color',
  'consistent multi_select colors using first color',
  'lowercase column names',
  'relations with leading emoji',
];

export const promptStandardsColumns = async (): Promise<string[]> => {
  const results = await prompt<ColumnsConfig>([
    {
      type: 'multiselect',
      message: 'Select standards to use:',
      name: 'configureStandardsColumns',
      choices: columnConfigChoices,
    },
  ]);
  console.log(
    'You selected:',
    results.configureStandardsColumns,
    typeof results.configureStandardsColumns
  );
  const selectedColumnConfig = results.configureStandardsColumns;
  console.log(
    'selectedColumnConfig:',
    selectedColumnConfig,
    typeof selectedColumnConfig
  );
  return results.configureStandardsColumns;
};

export default {
  name: 'configure-standards-columns',
  description:
    'configure the standards for columns of databases in the workspace',
  options: [
    {
      name: '-u, --use [configure-standards-columns]',
      description: 'select standards to use',
    },
  ],
  actionFactory: () => (options) => {
    assert(options);

    if (typeof options.use === 'string') {
      return;
    }

    if (options['use'] === undefined) {
      promptStandardsColumns();
    }
  },
} satisfies MountnCommand;
