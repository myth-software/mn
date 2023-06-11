import {
  CheckboxPropertyFilter,
  DatePropertyFilter,
  ExistencePropertyFilter,
  FormulaPropertyFilter,
  NumberPropertyFilter,
  PeoplePropertyFilter,
  QueryDatabaseBodyParameters,
  QueryDatabaseParameters,
  RelationPropertyFilter,
  RollupPropertyFilter,
  TextPropertyFilter,
} from './api-endpoints';
import { Entity } from './databases';
import { Merge } from './helpers';

export declare type TypedMultiSelectColumnFilter<
  T extends Entity,
  Property extends string | symbol | number,
  K extends T['options'] = T['options']
> =
  | {
      contains: K[Property][number];
    }
  | {
      does_not_contain: K[Property][number];
    }
  | ExistencePropertyFilter;

export declare type TypedSelectColumnFilter<
  T extends Entity,
  Property extends string | symbol | number,
  K extends T['options'] = T['options']
> =
  | {
      equals: K[Property][number];
    }
  | {
      does_not_equal: K[Property][number];
    }
  | ExistencePropertyFilter;

export declare type TypedSelectColumnFilterTwo<
  T extends Entity,
  Property extends string | symbol | number,
  K extends T['options'] = T['options']
> =
  | {
      equals: K[Property][number];
    }
  | {
      does_not_equal: K[Property][number];
    }
  | ExistencePropertyFilter;

export declare type Filter<
  T extends Entity,
  K extends keyof T['mappings'] = keyof T['mappings']
> = {
  [P in K]: Merge<
    {
      property: P;
    },
    {
      [Q in P]: T['columns'][T['mappings'][Q]] extends infer ColumnType
        ? ColumnType extends 'select'
          ? { select: TypedSelectColumnFilter<T, Q> }
          : ColumnType extends 'rich_text'
          ? { rich_text: TextPropertyFilter }
          : ColumnType extends 'title'
          ? { title: TextPropertyFilter }
          : ColumnType extends 'phone_number'
          ? { phone_number: TextPropertyFilter }
          : ColumnType extends 'url'
          ? { url: TextPropertyFilter }
          : ColumnType extends 'people'
          ? { people: PeoplePropertyFilter }
          : ColumnType extends 'date'
          ? { date: DatePropertyFilter }
          : ColumnType extends 'status'
          ? { status: TypedSelectColumnFilter<T, P> }
          : ColumnType extends 'email'
          ? { email: TextPropertyFilter }
          : ColumnType extends 'multi_select'
          ? { multi_select: TypedMultiSelectColumnFilter<T, P> }
          : ColumnType extends 'relation'
          ? { relation: RelationPropertyFilter }
          : ColumnType extends 'files'
          ? { files: ExistencePropertyFilter }
          : ColumnType extends 'created_by'
          ? { created_by: PeoplePropertyFilter }
          : ColumnType extends 'created_time'
          ? { created_time: DatePropertyFilter }
          : ColumnType extends 'last_edited_by'
          ? { last_edited_by: PeoplePropertyFilter }
          : ColumnType extends 'last_edited_time'
          ? { last_edited_time: DatePropertyFilter }
          : ColumnType extends 'rollup'
          ? { rollup: RollupPropertyFilter }
          : ColumnType extends 'formula'
          ? { formula: FormulaPropertyFilter }
          : ColumnType extends 'checkbox'
          ? { checkbox: CheckboxPropertyFilter }
          : ColumnType extends 'number'
          ? { number: NumberPropertyFilter }
          : never
        : never;
    }[P]
  >;
}[K];

export declare type OrFilter<T extends Entity> = {
  or: Array<Filter<T>>;
};

export declare type AndFilter<T extends Entity> = {
  and: Array<Filter<T>>;
};

export declare type MajorOrFilter<T extends Entity> = {
  or: Array<Filter<T> | OrFilter<T> | AndFilter<T>>;
};

export declare type MajorAndFilter<T extends Entity> = {
  and: Array<Filter<T> | OrFilter<T> | AndFilter<T>>;
};

export declare type QueryFilter<T extends Entity> =
  | Filter<T>
  | MajorOrFilter<T>
  | MajorAndFilter<T>;

/**
 *
 * [notion docs for filtering](https://developers.notion.com/reference/post-database-query-filter)
 * [notion docs for sorting](https://developers.notion.com/reference/post-database-query-sort)
 * */
export declare type MountNotionQueryParameters<T extends Entity> = {
  [Property in keyof QueryDatabaseBodyParameters]: Property extends 'filter'
    ? QueryFilter<T>
    : Property extends 'sorts'
    ? QuerySorts<T>
    : QueryDatabaseParameters[Property];
};

export declare type QuerySorts<T extends Entity> = Array<
  | {
      property: keyof T['mappings'];
      direction: 'ascending' | 'descending';
    }
  | {
      timestamp: 'created_time' | 'last_edited_time';
      direction: 'ascending' | 'descending';
    }
>;
