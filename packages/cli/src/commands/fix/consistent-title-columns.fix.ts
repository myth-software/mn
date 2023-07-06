import { notion } from '@mountnotion/sdk';
import { Fix } from '@mountnotion/types';

export async function fixColumnsConsistentTitle(fix: Fix) {
  await notion.databases.update({
    database_id: fix.database_id,
    properties: {
      [fix.column]: {
        name: 'name',
      },
    },
  });

  return {
    action: 'updating',
    page: fix.page,
    message: `title from '${fix.column}' to 'name'`,
  };
}
