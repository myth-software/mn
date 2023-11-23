import {
  DatabaseObjectResponse,
  GetDatabaseParameters,
} from '@mountnotion/types';

export const retrieveResponse = async (query: GetDatabaseParameters) => {
  const response = await fetch(
    'https://api.notion.com/v1/databases/' + query.database_id,
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

  const data = await response.json();
  return data as DatabaseObjectResponse;
};
