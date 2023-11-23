import {
  QueryDatabaseParameters,
  QueryDatabaseResponse,
} from '@mountnotion/types';

export const queryResponse = async ({
  database_id,
  ...body
}: QueryDatabaseParameters) => {
  const response = await fetch(
    `https://api.notion.com/v1/databases/${database_id}/query`,
    {
      method: 'POST',
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
    const json = await response.json();
    throw { status: response.status, message: json.message };
  }

  const data = (await response.json()) as QueryDatabaseResponse;

  return data;
};
