import type {
  AdditionalProperties,
  AdditionalPropertyTypes,
  MountNotionQueryParameters,
  ReadonlyColumnTypes,
} from '@mountnotion/types';
import { InferModel } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export declare type FilterArgs = {
  database: any;
  filter: any;
  property: string;
};

export declare type MountNotionClientDrizzleConfig = {
  db: PostgresJsDatabase;
  indicies: {
    [key: string]: any;
  };
};

export declare type MountNotionDrizzleClient<
  T extends MountNotionClientDrizzleConfig
> = {
  [Property in keyof T['indicies']]: T['indicies'][Property] extends infer Database extends T['indicies'][Property]
    ? {
        query: (
          query?: MountNotionQueryParameters<any>
        ) => Promise<InferModel<Database>[]>;
        retrieve: (
          body: Pick<AdditionalProperties, 'id'>
        ) => Promise<InferModel<Database>>;
        update: (
          body: {
            id: string;
          } & Omit<
            InferModel<Database, 'insert'>,
            ReadonlyColumnTypes & AdditionalPropertyTypes
          >
        ) => Promise<InferModel<Database>>;
        create: (
          body: Omit<
            InferModel<Database, 'insert'>,
            ReadonlyColumnTypes & AdditionalPropertyTypes
          >
        ) => Promise<InferModel<Database>>;
        delete: (
          body: Pick<AdditionalProperties, 'id'>
        ) => Promise<InferModel<Database>>;
      }
    : never;
};
