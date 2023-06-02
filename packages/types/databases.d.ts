import { AdditionalProperties, Columns, ReadonlyColumnTypes } from './columns';
import { DeepReadonly } from './helpers';

export declare type Mappings = Record<string | number | symbol, string>;
export declare type Relations = Record<string | number | symbol, string>;
export declare type Options = Record<string | number | symbol, string[]>;

export declare type FlatDatabase = {
  id: string;
  title: string;
  icon: string;
  description: string;
  cover: string;
  columns: Columns;
  options: Options | null;
  relations: Relations | null;
  mappings: Mappings;
};

export declare type Cache = FlatDatabase & {
  rollups: Columns;
  rollupsOptions: Options | null;
};

export declare type Entity = DeepReadonly<FlatDatabase>;

export declare type InferReadonly<T extends Entity> = {
  [P in keyof T['mappings'] as T['columns'][T['mappings'][P]] extends ReadonlyColumnTypes
    ? P
    : never]: T['columns'][T['mappings'][P]] extends infer ColumnType
    ? ColumnType extends 'created_by'
      ? string | null
      : ColumnType extends 'created_time'
      ? string | null
      : ColumnType extends 'last_edited_by'
      ? string | null
      : ColumnType extends 'last_edited_time'
      ? string | null
      : ColumnType extends 'rollup'
      ? number | number[] | boolean | boolean[] | string | string[] | null
      : ColumnType extends 'formula'
      ? string | null
      : never
    : never;
} & AdditionalProperties;

export declare type InferWriteonly<T extends Entity> = {
  [P in keyof T['mappings'] as T['columns'][T['mappings'][P]] extends ReadonlyColumnTypes
    ? never
    : P]: T['columns'][T['mappings'][P]] extends infer ColumnType
    ? ColumnType extends 'title'
      ? string | null
      : ColumnType extends 'rich_text'
      ? string | null
      : ColumnType extends 'phone_number'
      ? string | null
      : ColumnType extends 'url'
      ? string | null
      : ColumnType extends 'people'
      ? string | null
      : ColumnType extends 'date'
      ? string | null
      : ColumnType extends 'status'
      ? T['options'][T['mappings'][P]][number] | null
      : ColumnType extends 'select'
      ? T['options'][T['mappings'][P]][number] | null
      : ColumnType extends 'email'
      ? string | null
      : ColumnType extends 'multi_select'
      ? T['options'][T['mappings'][P]][number][] | null
      : ColumnType extends 'relation'
      ? string[] | null
      : ColumnType extends 'files'
      ? string[] | null
      : ColumnType extends 'checkbox'
      ? boolean
      : ColumnType extends 'number'
      ? number | null
      : never
    : never;
};

export type FullGetDatabaseResponse = GetDatabaseResponse & {
  icon: UpdatePageParameters['icon'];
};
