import { notion } from '@mountnotion/sdk';
import { Fix } from '@mountnotion/types';

export async function fixColumnsAutomaticCreatedTime(fix: Fix) {
  await notion.databases.update({
    database_id: fix.database_id,
    properties: {
      'created time': {
        created_time: {},
        name: 'created time',
        type: 'created_time',
      },
    },
  });

  return {
    action: 'creating',
    page: fix.page,
    message: 'created_time as "created time"',
  };
}
