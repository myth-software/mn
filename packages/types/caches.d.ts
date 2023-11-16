import { AdditionalProperties, Columns, ReadonlyColumnTypes } from './columns';
import { DeepReadonly } from './helpers';

export declare type Mappings = Record<string, string>;
export declare type Relations = Record<string, string>;
export declare type SyncedColumns = Record<string, string>;
export declare type Options = Record<string, string[]>;
export type Instance = Record<string, any> & AdditionalProperties;

export declare type Cache = DeepReadonly<{
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

export declare type InferReadonly<TCache extends Cache> = {
  [P in keyof TCache['mappings'] as TCache['columns'][TCache['mappings'][P]] extends ReadonlyColumnTypes
    ? P
    : never]: TCache['columns'][TCache['mappings'][P]] extends infer ColumnType
    ? ColumnType extends 'created_by'
      ? string | null
      : ColumnType extends 'created_time'
      ? string | null
      : ColumnType extends 'last_edited_by'
      ? string | null
      : ColumnType extends 'last_edited_time'
      ? string | null
      : ColumnType extends 'rollup'
      ? TCache['rollups'][TCache['mappings'][P]] extends 'relation'
        ? Array<string> | null
        : TCache['rollups'][TCache['mappings'][P]] extends
            | 'rich_text'
            | 'title'
            | 'phone_number'
            | 'email'
        ? string | null
        : TCache['rollups'][TCache['mappings'][P]] extends 'select' | 'status'
        ? TCache['rollupsOptions'][TCache['mappings'][P]][number] | null
        : TCache['rollups'][TCache['mappings'][P]] extends 'multi_select'
        ? TCache['rollupsOptions'][TCache['mappings'][P]] | null
        : TCache['rollups'][TCache['mappings'][P]] extends 'number'
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

export declare type InferWriteonly<TCache extends Cache> = {
  [P in keyof TCache['mappings'] as TCache['columns'][TCache['mappings'][P]] extends ReadonlyColumnTypes
    ? never
    : P]: TCache['columns'][TCache['mappings'][P]] extends infer ColumnType
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
      ? TCache['options'][TCache['mappings'][P]][number] | null
      : ColumnType extends 'select'
      ? TCache['options'][TCache['mappings'][P]][number] | null
      : ColumnType extends 'email'
      ? string | null
      : ColumnType extends 'multi_select'
      ? TCache['options'][TCache['mappings'][P]][number][] | null
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

export type Infer<TCache extends Cache> = InferWriteonly<TCache> &
  InferReadonly<TCache>;
