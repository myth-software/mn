import { ColumnsLintRules } from './lint-rules';
import { LogInput } from './log';

export declare type Fix = {
  id: keyof ColumnsLintRules;
  page: LogInput['page'];
  title: string;
  column: string;
  database_id: string;
};
