import { notion } from '@mountnotion/sdk';
import { Fix } from '@mountnotion/types';

export async function fixColumnsConsistentLastEditedBy(fix: Fix) {
  await notion.databases.update({
    database_id: fix.database_id,
    properties: {
      [fix.column]: {
        name: 'last edited by',
      },
    },
  });

  return {
    action: 'updating',
    page: fix.page,
    message: `last_edited_by from '${fix.column}' to 'last edited by'`,
  };
}
