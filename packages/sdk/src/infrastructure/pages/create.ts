import {
  Columns,
  CreatePageParameters,
  PageObjectResponse,
  ToolsConfiguration,
} from '@mountnotion/types';
import { flattenPageResponse } from '../../flatteners';
import client from '../client';

export async function create<Entity>(
  query: CreatePageParameters
): Promise<PageObjectResponse>;
export async function create<Entity>(
  query: CreatePageParameters,
  config: ToolsConfiguration
): Promise<[Entity, Columns]>;
export async function create<Entity>(
  body: CreatePageParameters,
  config?: ToolsConfiguration
) {
  try {
    const response = (await client().pages.create(body)) as PageObjectResponse;

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
