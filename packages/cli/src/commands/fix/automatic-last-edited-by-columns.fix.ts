import { notion } from '@mountnotion/sdk';
import { Fix } from '@mountnotion/types';

export async function fixColumnsAutomaticLastEditedBy(fix: Fix) {
  await notion.databases.update({
    database_id: fix.database_id,
    properties: {
      'last edited by': {
        last_edited_by: {},
        name: 'last edited by',
        type: 'last_edited_by',
      },
    },
  });

  return {
    action: 'creating',
    page: fix.page,
    message: 'last_edited_by as "last edited by"',
  };
}
