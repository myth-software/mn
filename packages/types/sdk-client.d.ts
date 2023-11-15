import {
  DeleteBlockResponse,
  SearchBodyParameters,
  SearchResponse,
} from './api-endpoints';
import { Cache, Infer, InferWriteonly } from './caches';
import { MountNotionQueryParameters } from './client';
import { AdditionalProperties } from './columns';

export declare type MountNotionClientConfig = {
  integrationKey?: string;
  caches: {
    [title: string]: Cache;
  };
};

export declare type MountNotionCrud<TCache extends Cache> = {
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
  [Property in keyof T['caches']]: T['caches'][Property] extends infer Database extends T['caches'][Property]
    ? MountNotionCrud<Database>
    : never;
} & {
  search: (body: SearchBodyParameters) => Promise<SearchResponse>;
};
