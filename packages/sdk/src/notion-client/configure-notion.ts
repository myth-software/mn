import {
  AdditionalProperties,
  EmojiRequest,
  Infer,
  InferWriteonly,
  MountNotionClient,
  MountNotionClientConfig,
  MountNotionQueryParameters,
  PageObjectResponse,
  QueryDatabaseBodyParameters,
  SearchBodyParameters,
} from '@mountnotion/types';
import { expandProperties } from '../expanders/properties.expander';
import { flattenPageResponse, flattenPageResponses } from '../flatteners';
import * as notion from '../infrastructure';
import { mapInstance } from './instance.mapper';
import { mapQuery } from './query.mapper';

export function configureNotion<Config extends MountNotionClientConfig>(
  config: Config
): MountNotionClient<Config> {
  const databases = Object.entries(config.caches).map(([title, cache]) => {
    type Cache = typeof cache;
    return [
      title,
      {
        query: async (args: MountNotionQueryParameters<Cache>) => {
          const query = args ? mapQuery(args, cache.mappings) : {};
          const response = await notion.databases.query<Cache>({
            database_id: cache.id,
            ...(query as QueryDatabaseBodyParameters),
          });

          const results = response.results as PageObjectResponse[];
          const [instances] = flattenPageResponses<Infer<Cache>>(results);

          return instances.map((instance) =>
            mapInstance(instance, cache.mappings)
          );
        },
        retrieve: async ({ id }: Pick<AdditionalProperties, 'id'>) => {
          const response = (await notion.pages.retrieve({
            page_id: id,
          })) as PageObjectResponse;
          const [instance] = flattenPageResponse<Infer<Cache>>(response);

          return mapInstance(instance, cache.mappings);
        },
        update: async ({
          id,
          ...body
        }: Pick<AdditionalProperties, 'id'> &
          Partial<InferWriteonly<Cache>>) => {
          const properties = expandProperties<Partial<InferWriteonly<Cache>>>(
            body,
            {
              columns: cache.columns,
              mappings: cache.mappings,
            }
          );

          const response = (await notion.pages.update({
            page_id: id,
            properties,
          })) as PageObjectResponse;
          const [instance] = flattenPageResponse<Infer<Cache>>(response);

          return mapInstance(instance, cache.mappings);
        },
        create: async (body: Partial<InferWriteonly<Cache>>) => {
          const properties = expandProperties<Partial<InferWriteonly<Cache>>>(
            body,
            {
              columns: cache.columns,
              mappings: cache.mappings,
            }
          );

          const response = (await notion.pages.create({
            parent: {
              database_id: cache.id,
            },
            icon: {
              type: 'emoji',
              emoji: cache.icon as EmojiRequest,
            },
            properties,
          })) as PageObjectResponse;
          const [instance] = flattenPageResponse<Infer<Cache>>(response);

          return mapInstance(instance, cache.mappings);
        },
        delete: async ({ id }: Pick<AdditionalProperties, 'id'>) =>
          notion.blocks.delete({
            block_id: id,
          }),
      },
    ];
  });

  const configured = Object.fromEntries(databases);
  return {
    ...configured,
    search: async (body: SearchBodyParameters) => notion.search(body),
  };
}
