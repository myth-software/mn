import {
  EmojiRequest,
  InferReadonly,
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
import client from '../infrastructure/client';
import { instanceMapper } from './instance.mapper';
import { queryMapper } from './query.mapper';

export function configure<Config extends MountNotionClientConfig>(
  config: Config
): MountNotionClient<Config> {
  const notion = client(config.integrationKey);

  const databases = Object.entries(config.indicies).map(([title, index]) => {
    type Database = typeof index;
    return [
      title,
      {
        query: async (args: MountNotionQueryParameters<Database>) => {
          const query = args ? queryMapper(args, index.mappings) : {};
          const response = await notion.databases.query({
            database_id: index.id,
            ...(query as QueryDatabaseBodyParameters),
          });

          const results = response.results as PageObjectResponse[];
          const [instances] = flattenPageResponses<
            InferReadonly<Database> & InferWriteonly<Database>
          >(results);

          return instances.map((instance) =>
            instanceMapper(instance, index.mappings)
          );
        },
        retrieve: async ({ id }: { id: string }) => {
          const response = (await notion.pages.retrieve({
            page_id: id,
          })) as PageObjectResponse;
          const [instance] = flattenPageResponse<
            InferReadonly<Database> & InferWriteonly<Database>
          >(response);

          return instanceMapper(instance, index.mappings);
        },
        update: async ({
          id,
          ...body
        }: { id: string } & Partial<InferWriteonly<Database>>) => {
          const properties = expandProperties<
            Partial<InferWriteonly<Database>>
          >(body, {
            columns: index.columns,
            mappings: index.mappings,
          });

          const response = (await notion.pages.update({
            page_id: id,
            properties,
          })) as PageObjectResponse;
          const [instance] = flattenPageResponse<
            InferReadonly<Database> & InferWriteonly<Database>
          >(response);

          return instanceMapper(instance, index.mappings);
        },
        create: async (body: Partial<InferWriteonly<Database>>) => {
          const properties = expandProperties<
            Partial<InferWriteonly<Database>>
          >(body, {
            columns: index.columns,
            mappings: index.mappings,
          });

          const response = (await notion.pages.create({
            parent: {
              database_id: index.id,
            },
            icon: {
              type: 'emoji',
              emoji: index.icon as EmojiRequest,
            },
            properties,
          })) as PageObjectResponse;
          const [instance] = flattenPageResponse<
            InferReadonly<Database> & InferWriteonly<Database>
          >(response);

          return instanceMapper(instance, index.mappings);
        },
      },
    ];
  });

  const configured = Object.fromEntries(databases);
  return {
    ...configured,
    delete: async ({ id }: { id: string }) =>
      notion.blocks.delete({
        block_id: id,
      }),
    search: async (body: SearchBodyParameters) => notion.search(body),
  };
}
