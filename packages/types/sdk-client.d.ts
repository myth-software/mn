import {
  DeleteBlockResponse,
  SearchBodyParameters,
  SearchResponse,
} from './api-endpoints';
import { MountNotionQueryParameters } from './client';
import { AdditionalProperties } from './columns';
import { Infer, InferWriteonly, Schema } from './schema';

export declare type MountNotionClientConfig = {
  integrationKey?: string;
  schema: {
    [title: string]: Schema;
  };
};

export declare type MountNotionCrud<TSchema extends Schema> = {
  query: (
    query?: MountNotionQueryParameters<TSchema>
  ) => Promise<Infer<TSchema>[]>;
  retrieve: (body: Pick<AdditionalProperties, 'id'>) => Promise<Infer<TSchema>>;
  update: (
    body: Pick<AdditionalProperties, 'id'> & Partial<InferWriteonly<TSchema>>
  ) => Promise<Infer<TSchema>>;
  create: (body: Partial<InferWriteonly<TSchema>>) => Promise<Infer<TSchema>>;
  delete: (
    body: Pick<AdditionalProperties, 'id'>
  ) => Promise<DeleteBlockResponse>;
};

export declare type MountNotionClient<T extends MountNotionClientConfig> = {
  [Property in keyof T['schema']]: T['schema'][Property] extends infer Database extends T['schema'][Property]
    ? MountNotionCrud<Database>
    : never;
} & {
  search: (body: SearchBodyParameters) => Promise<SearchResponse>;
};
