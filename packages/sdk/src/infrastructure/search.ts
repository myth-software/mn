import { SearchBodyParameters, SearchResponse } from '@mountnotion/types';

export default async function async(query: SearchBodyParameters) {
  const response = await fetch('https://api.notion.com/v1/search', {
    method: 'POST',
    headers: {
      Authorization: process.env['NOTION_INTEGRATION_KEY']
        ? process.env['NOTION_INTEGRATION_KEY']
        : '',
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify(query),
  });

  if (!response.ok) {
    const json = await response.json();
    throw { status: response.status, message: json.message };
  }

  return (await response.json()) as SearchResponse;
}
