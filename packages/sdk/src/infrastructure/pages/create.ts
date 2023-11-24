import {
  Columns,
  CreatePageParameters,
  PageObjectResponse,
  ToolsConfiguration,
} from '@mountnotion/types';
import { flattenPageResponse } from '../../flatteners';

export async function create<TSchema>(
  query: CreatePageParameters
): Promise<PageObjectResponse>;
export async function create<TSchema>(
  query: CreatePageParameters,
  config: ToolsConfiguration
): Promise<[TSchema, Columns]>;
export async function create<TSchema>(
  body: CreatePageParameters,
  config?: ToolsConfiguration
) {
  const response = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
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

  const data = await response.json();

  if (!config) {
    return data as PageObjectResponse;
  }

  const schema = flattenPageResponse<TSchema>(data);

  return schema;
}
