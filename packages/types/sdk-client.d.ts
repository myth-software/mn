import {
  DeleteBlockResponse,
  SearchBodyParameters,
  SearchResponse,
} from './api-endpoints';
import { MountNotionQueryParameters } from './client';
import { AdditionalProperties } from './columns';
import { Entity, Infer, InferWriteonly } from './databases';

export declare type MountNotionClientConfig = {
  integrationKey?: string;
  indicies: {
    [title: string]: Entity;
  };
};

export declare type MountNotionCrud<TCache extends Entity> = {
  query: (
    query?: MountNotionQueryParameters<TCache>
  ) => Promise<Infer<TCache>[]>;
  retrieve: (body: Pick<AdditionalProperties, 'id'>) => Promise<Infer<TCache>>;
  update: (
    body: Pick<AdditionalProperties, 'id'> & Partial<InferWriteonly<TCache>>
  ) => Promise<Infer<TCache>>;
  create: (body: Partial<InferWriteonly<TCache>>) => Promise<Infer<TCache>>;
  delete: (
    body: Pick<AdditionalProperties, 'id'>
  ) => Promise<DeleteBlockResponse>;
};

export declare type MountNotionClient<T extends MountNotionClientConfig> = {
  [Property in keyof T['indicies']]: T['indicies'][Property] extends infer Database extends T['indicies'][Property]
    ? MountNotionCrud<Database>
    : never;
} & {
  search: (body: SearchBodyParameters) => Promise<SearchResponse>;
};
