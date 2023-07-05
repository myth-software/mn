import { notion } from '@mountnotion/sdk';
import { Fix } from '@mountnotion/types';

export async function fixColumnsConsistentLastEditedTime(fix: Fix) {
  await notion.databases.update({
    database_id: fix.database_id,
    properties: {
      [fix.column]: {
        name: 'last edited time',
      },
    },
  });

  return {
    action: 'updating',
    page: fix.page,
    message: `last_edited_time from '${fix.column}' to 'last edited time'`,
  };
}
