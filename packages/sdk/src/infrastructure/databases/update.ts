import {
  UpdateDatabaseParameters,
  UpdateDatabaseResponse,
} from '@mountnotion/types';

export const update = async ({
  database_id,
  ...body
}: UpdateDatabaseParameters) => {
  const response = await fetch(
    'https://api.notion.com/v1/databases/' + database_id,
    {
      method: 'PATCH',
      headers: {
        Authorization: process.env['NOTION_INTEGRATION_KEY']
          ? process.env['NOTION_INTEGRATION_KEY']
          : '',
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to update database');
  }

  const data = await response.json();
  return data as UpdateDatabaseResponse;
};
