import { LogInput } from './cli';
import { ColumnsLintRules, RowsLintRules } from './lint-rules';

export declare type Fix = {
  id: ColumnsLintRules | RowsLintRules;
  page: LogInput['page'];
  title: string;
  column: string;
  database_id: string;
};
