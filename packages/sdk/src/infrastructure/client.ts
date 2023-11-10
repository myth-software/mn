import { Client } from '@notionhq/client';

export declare type Notion = ReturnType<typeof client>;

export const client = (auth?: string) =>
  new Client({
    auth: auth ?? process.env['NOTION_INTEGRATION_KEY'],
    notionVersion: '2022-06-28',
  });

export default client;
