import { LogInput } from './cli';
import { ColumnsLintRules } from './lint-rules';

export declare type Fix = {
  id: keyof ColumnsLintRules;
  page: LogInput['page'];
  title: string;
  column: string;
  database_id: string;
};
