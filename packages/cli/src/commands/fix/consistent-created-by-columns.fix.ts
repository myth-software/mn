import { notion } from '@mountnotion/sdk';
import { Fix } from '@mountnotion/types';

export async function fixColumnsConsistentCreatedBy(fix: Fix) {
  await notion.databases.update({
    database_id: fix.database_id,
    properties: {
      [fix.column]: {
        name: 'created by',
      },
    },
  });

  return {
    action: 'updating',
    page: fix.page,
    message: `created_by from '${fix.column}' to 'created by'`,
  };
}
