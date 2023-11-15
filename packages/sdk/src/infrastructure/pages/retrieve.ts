import {
  Columns,
  GetPageParameters,
  PageObjectResponse,
  ToolsConfiguration,
} from '@mountnotion/types';
import { flattenPageResponse } from '../../flatteners';
import client from '../client';

export async function retrieve<TCache>(
  query: GetPageParameters
): Promise<PageObjectResponse>;
export async function retrieve<TCache>(
  query: GetPageParameters,
  config: ToolsConfiguration
): Promise<[TCache, Columns]>;
export async function retrieve<TCache>(
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

    const cache = flattenPageResponse<TCache>(response);

    return cache;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
