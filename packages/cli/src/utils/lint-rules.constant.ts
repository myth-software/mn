import { ColumnsLintRules, RowsLintRules } from '@mountnotion/types';

type ColunnsLintRulesArray<
  T extends keyof ColumnsLintRules = keyof ColumnsLintRules
> = {
  [P in keyof ColumnsLintRules]: {
    id: P;
    name: ColumnsLintRules[P];
    description?: string;
  };
}[T][];

type RowsLintRulesArray<T extends keyof RowsLintRules = keyof RowsLintRules> = {
  [P in keyof RowsLintRules]: {
    id: P;
    name: RowsLintRules[P];
    description?: string;
  };
}[T][];

export const COLUMNS_LINT_RULES: ColunnsLintRulesArray = [
  {
    id: 'consistentTitlesAsName',
    name: "consistent titles as 'name'",
    description: 'all of the title columns of workspace are called "name"',
  },
  {
    id: 'automaticCreatedBy',
    name: 'automatic created_by',
    description: 'all of the databases have created_by column',
  },
  {
    id: 'automaticCreatedTime',
    name: 'automatic created_time',
    description: 'all of the databases have created_time column',
  },
  {
    id: 'automaticLastEditedBy',
    name: 'automatic last_edited_by',
    description: 'all of the databases have last_edited_by column',
  },
  {
    id: 'automaticLastEditedTime',
    name: 'automatic last_edited_time',
    description: 'all of the databases have last_edited_time column',
  },
  {
    id: 'consistentCreatedBy',
    name: 'consistent created_by',
    description: 'all of the databases have consistent created_by column names',
  },
  {
    id: 'consistentCreatedTime',
    name: 'consistent created_time',
    description:
      'all of the databases have consistent created_time column names',
  },
  {
    id: 'consistentLastEditedBy',
    name: 'consistent last_edited_by',
    description:
      'all of the databases have consistent last_edited_by column names',
  },
  {
    id: 'consistentLastEditedTime',
    name: 'consistent last_edited_time',
    description:
      'all of the databases have consistent last_edited_time column names',
  },
  {
    id: 'consistentSelectColorsUsingFirstColor',
    name: 'consistent select colors using first color',
  },
  {
    id: 'consistentMultiSelectColorsUsingFirstColor',
    name: 'consistent multi_select colors using first color',
  },
  {
    id: 'lowercaseColumnNames',
    name: 'lowercase column names',
  },
  {
    id: 'relationsWithLeadingEmoji',
    name: 'relations with leading emoji',
  },
];

export const ROWS_LINT_RULES: RowsLintRulesArray = [
  {
    id: 'lowercasePageTitles',
    name: 'lowercase page titles',
  },
  {
    id: 'untitledPagesDefaultToAnimalColorNames',
    name: 'untitled pages default to animal color names',
  },
  {
    id: 'pagesWithoutIconsDefaultToDatabaseIcon',
    name: 'pages without icons default to database icon',
  },
];
