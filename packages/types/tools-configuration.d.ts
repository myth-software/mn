import { Columns } from './columns';

export declare type ToolsConfiguration = {
  flattenResponse?: boolean;
  resultsOnly?: boolean;
  all?: boolean;
  columns?: Columns;
};

export declare type ExpandColumnsConfiguration = ToolsConfiguration & {
  columns: Columns;
};
