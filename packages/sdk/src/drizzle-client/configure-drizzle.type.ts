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

export declare type MountNotionClientDrizzleConfig = {
  db: PostgresJsDatabase;
  schema: {
    [key: string]: any;
  };
};

export declare type MountNotionDrizzleClient<
  T extends MountNotionClientDrizzleConfig
> = {
  [Property in keyof T['schema']]: T['schema'][Property] extends infer Database extends T['schema'][Property]
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
