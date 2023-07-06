import { notion } from '@mountnotion/sdk';
import { Fix } from '@mountnotion/types';

export async function fixColumnsConsistentCreatedTime(fix: Fix) {
  await notion.databases.update({
    database_id: fix.database_id,
    properties: {
      [fix.column]: {
        name: 'created time',
      },
    },
  });

  return {
    action: 'updating',
    page: fix.page,
    message: `created_time from '${fix.column}' to 'created time'`,
  };
}
