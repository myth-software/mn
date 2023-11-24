import {
  Columns,
  PageObjectResponse,
  ToolsConfiguration,
  UpdatePageParameters,
} from '@mountnotion/types';
import { flattenPageResponse } from '../../flatteners';

export async function update<TSchema>({
  page_id,
  ...body
}: UpdatePageParameters): Promise<PageObjectResponse>;
export async function update<TSchema>(
  { page_id, ...body }: UpdatePageParameters,
  config?: ToolsConfiguration
): Promise<[TSchema, Columns]>;
export async function update<TSchema>(
  { page_id, ...body }: UpdatePageParameters,
  config?: ToolsConfiguration
) {
  const response = await fetch(`https://api.notion.com/v1/pages/${page_id}`, {
    method: 'PATCH',
    headers: {
      Authorization: process.env['NOTION_INTEGRATION_KEY']
        ? process.env['NOTION_INTEGRATION_KEY']
        : '',
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const json = await response.json();
    throw { status: response.status, message: json.message };
  }

  const responseData = await response.json();

  const pageResponse = responseData as PageObjectResponse;

  if (!config) {
    return pageResponse;
  }

  const schema = flattenPageResponse<TSchema>(pageResponse);

  return schema;
}
