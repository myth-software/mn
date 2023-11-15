import {
  Columns,
  CreatePageParameters,
  PageObjectResponse,
  ToolsConfiguration,
} from '@mountnotion/types';
import { flattenPageResponse } from '../../flatteners';
import client from '../client';

export async function create<TCache>(
  query: CreatePageParameters
): Promise<PageObjectResponse>;
export async function create<TCache>(
  query: CreatePageParameters,
  config: ToolsConfiguration
): Promise<[TCache, Columns]>;
export async function create<TCache>(
  body: CreatePageParameters,
  config?: ToolsConfiguration
) {
  try {
    const response = (await client().pages.create(body)) as PageObjectResponse;

    if (!config) {
      return response;
    }

    const cache = flattenPageResponse<TCache>(response);

    return cache;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
