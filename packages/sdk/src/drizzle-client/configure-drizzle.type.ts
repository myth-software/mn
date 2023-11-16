import type {
  AdditionalProperties,
  AdditionalPropertyTypes,
  MountNotionQueryParameters,
  ReadonlyColumnTypes,
} from '@mountnotion/types';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export declare type FilterArgs = {
  database: any;
  filter: any;
  property: string;
};

export declare type MountNotionClientDrizzleConfig<
  TSchema extends Record<string, unknown>
> = {
  db: PostgresJsDatabase<TSchema>;
  schema: {
    [key: string]: any;
  };
};

export declare type MountNotionDrizzleClient<
  TConfig extends MountNotionClientDrizzleConfig<TConfig['schema']>
> = {
  [Property in keyof TConfig['schema']]: TConfig['schema'][Property] extends infer Database extends TConfig['schema'][Property]
    ? {
        query: (
          query?: MountNotionQueryParameters<any>
        ) => Promise<InferSelectModel<Database>[]>;
        retrieve: (
          body: Pick<AdditionalProperties, 'id'>
        ) => Promise<InferSelectModel<Database>>;
        update: (
          body: {
            id: string;
          } & Omit<
            InferInsertModel<Database>,
            ReadonlyColumnTypes & AdditionalPropertyTypes
          >
        ) => Promise<InferSelectModel<Database>>;
        create: (
          body: Omit<
            InferInsertModel<Database>,
            ReadonlyColumnTypes & AdditionalPropertyTypes
          >
        ) => Promise<InferSelectModel<Database>>;
        delete: (
          body: Pick<AdditionalProperties, 'id'>
        ) => Promise<InferSelectModel<Database>>;
      }
    : never;
};
