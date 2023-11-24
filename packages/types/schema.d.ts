import { AdditionalProperties, Columns, ReadonlyColumnTypes } from './columns';
import { DeepReadonly } from './helpers';

export declare type Mappings = Record<string, string>;
export declare type Relations = Record<string, string>;
export declare type SyncedColumns = Record<string, string>;
export declare type Options = Record<string, string[]>;
export type Instance = Record<string, any> & AdditionalProperties;

export declare type Schema = DeepReadonly<{
  id: string;
  title: string;
  icon: string;
  description: string;
  cover: string;
  columns: Columns;
  options: Options | null;
  relations: Relations | null;
  syncedColumns: SyncedColumns | null;
  mappings: Mappings;
  rollups: Columns | null;
  rollupsOptions: Options | null;
}>;

export declare type InferReadonly<TSchema extends Schema> = {
  [P in keyof TSchema['mappings'] as TSchema['columns'][TSchema['mappings'][P]] extends ReadonlyColumnTypes
    ? P
    : never]: TSchema['columns'][TSchema['mappings'][P]] extends infer ColumnType
    ? ColumnType extends 'created_by'
      ? string | null
      : ColumnType extends 'created_time'
      ? string | null
      : ColumnType extends 'last_edited_by'
      ? string | null
      : ColumnType extends 'last_edited_time'
      ? string | null
      : ColumnType extends 'rollup'
      ? TSchema['rollups'][TSchema['mappings'][P]] extends 'relation'
        ? Array<string> | null
        : TSchema['rollups'][TSchema['mappings'][P]] extends
            | 'rich_text'
            | 'title'
            | 'phone_number'
            | 'email'
        ? string | null
        : TSchema['rollups'][TSchema['mappings'][P]] extends 'select' | 'status'
        ? TSchema['rollupsOptions'][TSchema['mappings'][P]][number] | null
        : TSchema['rollups'][TSchema['mappings'][P]] extends 'multi_select'
        ? TSchema['rollupsOptions'][TSchema['mappings'][P]] | null
        : TSchema['rollups'][TSchema['mappings'][P]] extends 'number'
        ? number | null
        :
            | number
            | Array<number>
            | boolean
            | Array<boolean>
            | string
            | Array<string>
            | null
      : ColumnType extends 'formula'
      ? string | null
      : never
    : never;
} & AdditionalProperties;

export declare type InferWriteonly<TSchema extends Schema> = {
  [P in keyof TSchema['mappings'] as TSchema['columns'][TSchema['mappings'][P]] extends ReadonlyColumnTypes
    ? never
    : P]: TSchema['columns'][TSchema['mappings'][P]] extends infer ColumnType
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
      ? TSchema['options'][TSchema['mappings'][P]][number] | null
      : ColumnType extends 'select'
      ? TSchema['options'][TSchema['mappings'][P]][number] | null
      : ColumnType extends 'email'
      ? string | null
      : ColumnType extends 'multi_select'
      ? TSchema['options'][TSchema['mappings'][P]][number][] | null
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

export type Infer<TSchema extends Schema> = InferWriteonly<TSchema> &
  InferReadonly<TSchema>;
