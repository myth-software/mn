import { DeleteBlockParameters } from '@mountnotion/types';

export const del = async (input: DeleteBlockParameters) => {
  const response = await fetch(
    'https://api.notion.com/v1/blocks/' + input.block_id,
    {
      method: 'DELETE',
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

  return response;
};
