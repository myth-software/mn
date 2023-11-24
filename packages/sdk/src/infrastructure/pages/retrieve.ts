import {
  Columns,
  GetPageParameters,
  PageObjectResponse,
  ToolsConfiguration,
} from '@mountnotion/types';
import { ensure } from '@mountnotion/utils';
import { flattenPageResponse } from '../../flatteners';

export async function retrieve<TSchema>(
  query: GetPageParameters
): Promise<PageObjectResponse>;
export async function retrieve<TSchema>(
  query: GetPageParameters,
  config: ToolsConfiguration
): Promise<[TSchema, Columns]>;
export async function retrieve<TSchema>(
  query: GetPageParameters,
  config?: ToolsConfiguration
) {
  const response = await fetch(
    `https://api.notion.com/v1/pages/${query.page_id}`,
    {
      headers: {
        Authorization: ensure(process.env['NOTION_INTEGRATION_KEY']),
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
    }
  );

  if (!response.ok) {
    const json = await response.json();
    throw { status: response.status, message: json.message };
  }

  const responseData = await response.json();

  if (!config) {
    return responseData as PageObjectResponse;
  }

  const schema = flattenPageResponse<TSchema>(responseData);

  return schema;
}
