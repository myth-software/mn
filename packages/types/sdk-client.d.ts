import {
  DeleteBlockResponse,
  SearchBodyParameters,
  SearchResponse,
} from './api-endpoints';
import { MountNotionQueryParameters } from './client';
import { Entity, InferReadonly, InferWriteonly } from './databases';

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
        delete: (body: { id: string }) => Promise<DeleteBlockResponse>;
      }
    : never;
} & {
  search: (body: SearchBodyParameters) => Promise<SearchResponse>;
};
