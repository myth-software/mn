import {
  ListBlockChildrenParameters,
  ListBlockChildrenResponse,
} from '@mountnotion/types';

export const list = async (query: ListBlockChildrenParameters) => {
  const response = await fetch(
    'https://api.notion.com/v1/blocks/' + query.block_id + '/children',
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
    const json = await response.json();
    throw { status: response.status, message: json.message };
  }

  const data = (await response.json()) as ListBlockChildrenResponse;

  return data;
};
