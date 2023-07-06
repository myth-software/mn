import { notion } from '@mountnotion/sdk';
import { Fix } from '@mountnotion/types';

export async function fixColumnsAutomaticLastEditedTime(fix: Fix) {
  await notion.databases.update({
    database_id: fix.database_id,
    properties: {
      'last edited time': {
        last_edited_time: {},
        name: 'last edited time',
        type: 'last_edited_time',
      },
    },
  });

  return {
    action: 'creating',
    page: fix.page,
    message: 'last_edited_time as "last edited time"',
  };
}
