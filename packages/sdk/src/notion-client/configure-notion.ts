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
  const databases = Object.entries(config.schema).map(([title, schema]) => {
    type Schema = typeof schema;
    return [
      title,
      {
        query: async (args: MountNotionQueryParameters<Schema>) => {
          const query = args ? mapQuery(args, schema.mappings) : {};
          const response = await notion.databases.query<Schema>({
            database_id: schema.id,
            ...(query as QueryDatabaseBodyParameters),
          });

          const results = response.results as PageObjectResponse[];
          const [instances] = flattenPageResponses<Infer<Schema>>(results);

          return instances.map((instance) =>
            mapInstance(instance, schema.mappings)
          );
        },
        retrieve: async ({ id }: Pick<AdditionalProperties, 'id'>) => {
          const response = (await notion.pages.retrieve({
            page_id: id,
          })) as PageObjectResponse;
          const [instance] = flattenPageResponse<Infer<Schema>>(response);

          return mapInstance(instance, schema.mappings);
        },
        update: async ({
          id,
          ...body
        }: Pick<AdditionalProperties, 'id'> &
          Partial<InferWriteonly<Schema>>) => {
          const properties = expandProperties<Partial<InferWriteonly<Schema>>>(
            body,
            {
              columns: schema.columns,
              mappings: schema.mappings,
            }
          );

          const response = (await notion.pages.update({
            page_id: id,
            properties,
          })) as PageObjectResponse;
          const [instance] = flattenPageResponse<Infer<Schema>>(response);

          return mapInstance(instance, schema.mappings);
        },
        create: async (body: Partial<InferWriteonly<Schema>>) => {
          const properties = expandProperties<Partial<InferWriteonly<Schema>>>(
            body,
            {
              columns: schema.columns,
              mappings: schema.mappings,
            }
          );

          const response = (await notion.pages.create({
            parent: {
              database_id: schema.id,
            },
            icon: {
              type: 'emoji',
              emoji: schema.icon as EmojiRequest,
            },
            properties,
          })) as PageObjectResponse;
          const [instance] = flattenPageResponse<Infer<Schema>>(response);

          return mapInstance(instance, schema.mappings);
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
