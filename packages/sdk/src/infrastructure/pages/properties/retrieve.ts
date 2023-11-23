import { GetPagePropertyParameters } from '@mountnotion/types';

export const retrieve = async (query: GetPagePropertyParameters) => {
  const response = await fetch(
    `https://api.notion.com/v1/pages/${query.page_id}/properties/${query.property_id}`,
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
    throw new Error('Failed to retrieve page properties');
  }

  return await response.json();
};
