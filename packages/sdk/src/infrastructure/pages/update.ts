import {
  Columns,
  PageObjectResponse,
  ToolsConfiguration,
  UpdatePageParameters,
} from '@mountnotion/types';
import { flattenPageResponse } from '../../flatteners';
import client from '../client';

export async function update<T>(
  body: UpdatePageParameters
): Promise<PageObjectResponse>;
export async function update<T>(
  body: UpdatePageParameters,
  config?: ToolsConfiguration
): Promise<[T, Columns]>;
export async function update<T>(
  body: UpdatePageParameters,
  config?: ToolsConfiguration
) {
  try {
    const response = (await client().pages.update(body)) as PageObjectResponse;

    if (!config) {
      return response;
    }

    const entity = flattenPageResponse<T>(response);

    return entity;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
