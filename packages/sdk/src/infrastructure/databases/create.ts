import { CreateDatabaseResponse, NewFlatDatabase } from '@mountnotion/types';
import { expandFlatDatabaseToNotionProperties } from '../../expanders/flat-database-to-notion-properties.expander';
import { expandTitle } from '../../expanders/title.expander';

export async function create(
  parentPageId: string,
  flat: NewFlatDatabase,
  apiKey?: string
): Promise<CreateDatabaseResponse> {
  const url = 'https://api.notion.com/v1/databases';
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Notion-Version': '2022-02-22',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      parent: {
        type: 'page_id',
        page_id: parentPageId,
      },
      ...expandTitle(flat.title),
      properties: expandFlatDatabaseToNotionProperties(flat),
    }),
  };

  const response = await fetch(url, options);
  const data = await response.json();
  if (response.ok) {
    return data as CreateDatabaseResponse;
  } else {
    console.log(data);
    throw new Error('failed to create database');
  }
}
