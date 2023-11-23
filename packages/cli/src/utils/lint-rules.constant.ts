import { ColumnsLintRules, RowsLintRules } from '@mountnotion/types';

type ColunnsLintRulesArray<T extends ColumnsLintRules = ColumnsLintRules> = {
  [P in ColumnsLintRules]: {
    id: P;
    description?: string;
  };
}[T][];

type RowsLintRulesArray<T extends RowsLintRules = RowsLintRules> = {
  [P in RowsLintRules]: {
    id: P;
    description?: string;
  };
}[T][];

export const COLUMNS_LINT_RULES: ColunnsLintRulesArray = [
  {
    id: 'column-consistent-titles-as-name',
    description: 'all of the title columns of workspace are called "name"',
  },
  {
    id: 'column-automatic-created-by',
    description: 'all of the databases have created_by column',
  },
  {
    id: 'column-automatic-created-time',
    description: 'all of the databases have created_time column',
  },
  {
    id: 'column-automatic-last-edited-by',
    description: 'all of the databases have last_edited_by column',
  },
  {
    id: 'column-consistent-last-edited-time',
    description: 'all of the databases have last_edited_time column',
  },
  {
    id: 'column-consistent-created-by',
    description: 'all of the databases have consistent created_by column names',
  },
  {
    id: 'column-consistent-created-time',
    description:
      'all of the databases have consistent created_time column names',
  },
  {
    id: 'column-automatic-last-edited-by',
    description:
      'all of the databases have consistent last_edited_by column names',
  },
  {
    id: 'column-automatic-last-edited-time',
    description:
      'all of the databases have consistent last_edited_time column names',
  },
  {
    id: 'column-consistent-select-colors-using-first-color',
    description:
      'all of the select options match the color of the first option in the select',
  },
  {
    id: 'column-consistent-multi-select-colors-using-first-color',
    description:
      'all of the multi-select options match the color of the first option in the multi-select',
  },
  {
    id: 'column-lowercase-names',
    description: 'all of the columns have lower cased names',
  },
  {
    id: 'column-relations-with-leading-emoji',
    description: 'for relation columns the first character is an emoji',
  },
];

export const ROWS_LINT_RULES: RowsLintRulesArray = [
  {
    id: 'row-lowercase-titles',
    description: 'each row has lowercase titles',
  },
  {
    id: 'row-no-untitled',
    description: 'no row has an untitled title property',
  },
  {
    id: 'row-all-icons',
    description: 'all rows have icons',
  },
];
