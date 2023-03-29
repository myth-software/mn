import {
  DeleteBlockResponse,
  EmojiRequest,
  SearchBodyParameters,
  SearchResponse,
} from './api-endpoints';
import { MountNotionQueryParameters } from './client';
import { Entity, InferReadonly, InferWriteonly } from './databases';
import { ColumnsStandards, RowsStandards } from './standards';

export declare type AuthOptions = {
  strategy: string;
  usersDatabase: string;
  userColumn: string;
};

export declare type BasicOptions = {
  pageId: string;
  excludes: string[];
  cacheFile: string;
  outDir: string;
  baseUrl: string;
  entities: string;
};

export declare type MockApiOptions = BasicOptions & AuthOptions;

export declare type RtkQueryOptions = BasicOptions & AuthOptions;

export declare type ControllersOptions = {
  /**
   * organization to import in loopback repository
   */
  org: string;
  accessorProperty: string;
} & BasicOptions &
  AuthOptions;

export declare type LocalsOptions = BasicOptions & {
  all?: string[];
};

export declare type Schematics = {
  collection: string;
  name: string;
  options: { auth: AuthOptions; basic: BasicOptions };
};

export type MountNotionConfig = {
  auth:
    | {
        strategy: 'integration-key';
        key: string;
      }
    | {
        strategy: 'oauth';
        key: string;
        availablePages: {
          page_id: string;
          title: string;
          icon: EmojiRequest;
        }[];
      };
  workspace: {
    selectedPages: string[];
    standards: {
      columns: Partial<ColumnsStandards>;
      rows: Partial<RowsStandards>;
    };
  };
  options: { auth: AuthOptions; basic: BasicOptions };
  schematics: Schematics[];
};

export declare type MountNotionClientConfig = {
  integrationKey?: string;
  indicies: {
    [title: string]: Entity;
  };
};

export declare type MountNotionClient<T extends MountNotionClientConfig> = {
  [Property in keyof T['indicies']]: T['indicies'][Property] extends infer Database extends T['indicies'][Property]
    ? {
        query: (
          query?: MountNotionQueryParameters<Database>
        ) => Promise<(InferReadonly<Database> & InferWriteonly<Database>)[]>;
        retrieve: (body: {
          id: string;
        }) => Promise<InferReadonly<Database> & InferWriteonly<Database>>;
        update: (
          body: {
            id: string;
          } & Partial<InferWriteonly<Database>>
        ) => Promise<InferReadonly<Database> & InferWriteonly<Database>>;
        create: (
          body: Partial<InferWriteonly<Database>>
        ) => Promise<InferReadonly<Database> & InferWriteonly<Database>>;
      }
    : never;
} & {
  delete: (body: { id: string }) => Promise<DeleteBlockResponse>;
  search: (body: SearchBodyParameters) => Promise<SearchResponse>;
};
