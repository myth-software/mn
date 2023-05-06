import {
  Columns,
  GetPageParameters,
  PageObjectResponse,
  ToolsConfiguration,
} from '@mountnotion/types';
import { flattenPageResponse } from '../../flatteners';
import client from '../client';

export async function retrieve<Entity>(
  query: GetPageParameters
): Promise<PageObjectResponse>;
export async function retrieve<Entity>(
  query: GetPageParameters,
  config: ToolsConfiguration
): Promise<[Entity, Columns]>;
export async function retrieve<Entity>(
  query: GetPageParameters,
  config?: ToolsConfiguration
) {
  try {
    const response = (await client().pages.retrieve(
      query
    )) as PageObjectResponse;

    if (!config) {
      return response;
    }

    const entity = flattenPageResponse<Entity>(response);

    return entity;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
