import {
  Columns,
  PageObjectResponse,
  ToolsConfiguration,
  UpdatePageParameters,
} from '@mountnotion/types';
import { flattenPageResponse } from '../../flatteners';
import client from '../client';

export async function update<TCache>(
  body: UpdatePageParameters
): Promise<PageObjectResponse>;
export async function update<TCache>(
  body: UpdatePageParameters,
  config?: ToolsConfiguration
): Promise<[TCache, Columns]>;
export async function update<TCache>(
  body: UpdatePageParameters,
  config?: ToolsConfiguration
) {
  try {
    const response = (await client().pages.update(body)) as PageObjectResponse;

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
