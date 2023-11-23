import {
  AppendBlockChildrenParameters,
  AppendBlockChildrenResponse,
} from '@mountnotion/types';

export const append = async (query: AppendBlockChildrenParameters) => {
  const response = await fetch(
    `https://api.notion.com/v1/blocks/children/${query.block_id}/children`,
    {
      method: 'PATCH',
      headers: {
        Authorization: process.env['NOTION_INTEGRATION_KEY']
          ? process.env['NOTION_INTEGRATION_KEY']
          : '',
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify(query.children),
    }
  );

  if (!response.ok) {
    const json = await response.json();
    throw { status: response.status, message: json.message };
  }

  return response.json() as Promise<AppendBlockChildrenResponse>;
};
