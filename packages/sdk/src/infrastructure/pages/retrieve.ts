import {
  Columns,
  GetPageParameters,
  PageObjectResponse,
  ToolsConfiguration,
} from '@mountnotion/types';
import { flattenPageResponse } from '../../flatteners';

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
  const response = await fetch(
    `https://api.notion.com/v1/pages/${query.page_id}`,
    {
      headers: {
        Authorization: process.env['NOTION_INTEGRATION_KEY']
          ? process.env['NOTION_INTEGRATION_KEY']
          : '',
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to retrieve page');
  }

  const responseData = await response.json();

  if (!config) {
    return responseData as PageObjectResponse;
  }

  const cache = flattenPageResponse<TCache>(responseData);

  return cache;
}
