import {
  Cache,
  DeepReadonly,
  Instance,
  Merge,
  MountNotionCrud,
  Options,
} from '@mountnotion/types';

const addActions = ['add', 'upload'] as const;
const updateActions = ['edit'] as const;
const deleteActions = ['delete'] as const;
export const displayActions = [
  ...addActions,
  ...updateActions,
  ...deleteActions,
] as const;

export declare type AddAction = (typeof addActions)[number];
export declare type UpdateAction = (typeof updateActions)[number];
export declare type DeleteAction = (typeof deleteActions)[number];
export declare type DisplayAction = (typeof displayActions)[number];

export type Values = Record<string, string | boolean | string[] | number>;

export type TypedValues<
  T extends Cache,
  K extends keyof T['columns'] = keyof T['columns']
> = {
  [P in K]: T['columns'][P] extends infer ColumnType
    ? ColumnType extends 'select'
      ? string
      : ColumnType extends 'rich_text'
      ? string
      : ColumnType extends 'title'
      ? string
      : ColumnType extends 'phone_number'
      ? string
      : ColumnType extends 'url'
      ? string
      : ColumnType extends 'people'
      ? string
      : ColumnType extends 'date'
      ? string
      : ColumnType extends 'status'
      ? string
      : ColumnType extends 'email'
      ? string
      : ColumnType extends 'multi_select'
      ? Array<string>
      : ColumnType extends 'relation'
      ? Array<string>
      : ColumnType extends 'files'
      ? Array<string>
      : ColumnType extends 'created_by'
      ? string
      : ColumnType extends 'created_time'
      ? string
      : ColumnType extends 'last_edited_by'
      ? string
      : ColumnType extends 'last_edited_time'
      ? string
      : ColumnType extends 'rollup'
      ? string
      : ColumnType extends 'formula'
      ? string
      : ColumnType extends 'checkbox'
      ? boolean
      : ColumnType extends 'number'
      ? number
      : never
    : never;
};
export type Fields = Record<string, string>;
export type CheckboxTypes = 'checkbox' | 'switch';
export type DisplayLimit = 'none' | 'one';
export type FileKinds = 'pdf' | 'image' | 'video';

export declare type Displayable = {
  property?: string;
  isRequired?: boolean;
  isHidden?: boolean;
  isDisabled?: boolean;
  isTitle?: boolean;
  isSubtitle?: boolean;
  config?: {
    isMultiline?: boolean;
    kind?: FileKinds;
    limit?: DisplayLimit;
    defaultValue?: string;
    displayAs?: CheckboxTypes;
    useGetQuery?: any;
    time?: boolean;
    shortMonths?: boolean;
  };
};

export declare type TypedSelectDisplayable<
  TEntity extends Cache,
  TColumn extends string,
  TOptions extends TEntity['options'] = TEntity['options']
> = {
  defaultValue?: TOptions extends DeepReadonly<Options>
    ? TOptions[TColumn][number]
    : never;
};

export declare type SelectDisplayable = {
  defaultValue?: string;
};

export declare type RelationDisplayable = {
  useGetQuery: () => any;
};

export declare type TypedRelationDisplayable<TCache extends Cache> =
  MountNotionCrud<TCache>;

export declare type DateDisplayable = {
  time?: boolean;
  shortMonths?: boolean;
};

export declare type CheckboxDisplayable = {
  /**
   * displayAs is settable for checkbox type columns
   */
  displayAs?: CheckboxTypes;
};

export declare type RichTextDisplayable = {
  /**
   * isMultiline is settable for any cached column that is property type 'rich_text'
   * in the notion database. the only settable value is true, which displays inputs
   * as multiple lines in forms.
   */
  isMultiline?: boolean;
};

export declare type FilesDisplayable = {
  kind: FileKinds;
  limit?: DisplayLimit;
};

export declare type TypedDisplayable<
  TEntity extends Cache,
  TColumns extends keyof TEntity['columns'] = keyof TEntity['columns']
> = {
  [P in TColumns]: Merge<
    {
      property: P;
      isRequired?: boolean;
      isHidden?: boolean;
      isDisabled?: boolean;
      isTitle?: boolean;
      isSubtitle?: boolean;
    },
    {
      [Q in P]: TEntity['columns'][Q] extends infer ColumnType
        ? ColumnType extends 'select'
          ? { config?: TypedSelectDisplayable<TEntity, Q & string> }
          : ColumnType extends 'rich_text'
          ? { config?: RichTextDisplayable }
          : ColumnType extends 'title'
          ? { config?: never }
          : ColumnType extends 'phone_number'
          ? { config?: never }
          : ColumnType extends 'url'
          ? { config?: never }
          : ColumnType extends 'people'
          ? { config?: never }
          : ColumnType extends 'date'
          ? { config?: DateDisplayable }
          : ColumnType extends 'status'
          ? { config?: TypedSelectDisplayable<TEntity, P & string> }
          : ColumnType extends 'email'
          ? { config?: never }
          : ColumnType extends 'multi_select'
          ? { config?: TypedSelectDisplayable<TEntity, P & string> }
          : ColumnType extends 'relation'
          ? { config?: RelationDisplayable }
          : ColumnType extends 'files'
          ? { config?: FilesDisplayable }
          : ColumnType extends 'created_by'
          ? { config?: never }
          : ColumnType extends 'created_time'
          ? { config?: never }
          : ColumnType extends 'last_edited_by'
          ? { config?: never }
          : ColumnType extends 'last_edited_time'
          ? { config?: never }
          : ColumnType extends 'rollup'
          ? { config?: never }
          : ColumnType extends 'formula'
          ? { config?: never }
          : ColumnType extends 'checkbox'
          ? { config?: CheckboxDisplayable }
          : ColumnType extends 'number'
          ? { config?: never }
          : never
        : never;
    }[P]
  >;
}[TColumns];

/**
 * display configuration is used to describe all of the necessary information
 * about to display data in the application.
 *
 * this is the same information that a smart human needs to implement a display
 * by hand, structured in such a way that a dumb computer can understand.
 */
export declare type DisplayConfiguration = {
  /**
   * the id of the configuration, used for looking up the configuration from
   * a map of configurations.
   *
   * the id a human readable string often displayed as the title of a display.
   */
  id: string;
  /**
   * the cache being configured. it is all information including columns that
   * map each cache property to a database column type. column types are used
   * here to determine what to display.
   */
  cache: Cache;
  /**
   * can delete controls whether the accident victim may delete the cache.
   * by default the accident victim may delete the cache, the only settable
   * value is false and the result is the removal of the delete button.
   */
  canDelete?: boolean;
  /**
   * defaults to 'add'
   */
  addAction?: AddAction;
  /**
   * defaults to 'edit'
   */
  updateAction?: UpdateAction;
  /**
   * defaults to 'delete'
   */
  deleteAction?: DeleteAction;
  /**
   * limit
   */
  limit?: DisplayLimit;
  /**
   * order lists the properties of the cache to display in the order that
   * they are to be displayed in
   */
  order: Array<Displayable>;
};

/**
 * @see DisplayConfiguration
 */
export declare type TypedDisplayConfiguration<
  TCache extends Cache,
  L extends Array<TypedDisplayable<TCache>> = Array<TypedDisplayable<TCache>>
> = {
  id: string;
  cache: TCache;
  limit?: DisplayLimit;
  canDelete?: false;
  addAction?: AddAction;
  updateAction?: UpdateAction;
  deleteAction?: DeleteAction;
  order: L;
};

export declare type TypedDisplay<
  TCache extends Cache,
  K extends DisplayLimit | undefined
> = TypedDisplayConfiguration<TCache> & {
  title: string;
  fields: Fields;
  action: DisplayAction;
  actions: Record<DisplayAction, string>;
  initialValues: TypedValues<TCache>;
  displayValues: TypedValues<TCache>;
  options?: Options;
  hasData: boolean;
  /**
   * limit controls whether the display allows for multiple caches.
   */
  limit: K;
  instances?: K extends 'none' | undefined ? Array<Instance> : never;
  instance?: K extends 'one' ? Instance : never;
};

/**
 * a display
 */
export declare type Display = DisplayConfiguration & {
  title: string;
  fields: Fields;
  options?: Options;
  action: DisplayAction;
  actions: Record<DisplayAction, string>;
  hasData: boolean;
  limit?: DisplayLimit;
  initialValues: Values;
  displayValues: Values;
  instance?: Instance;
  instances?: Array<Instance>;
};
