import { notion } from '@mountnotion/sdk';
import { Fix } from '@mountnotion/types';

export async function fixColumnsAutomaticCreatedBy(fix: Fix) {
  await notion.databases.update({
    database_id: fix.database_id,
    properties: {
      'created by': {
        created_by: {},
        name: 'created by',
        type: 'created_by',
      },
    },
  });

  return {
    action: 'creating',
    page: fix.page,
    message: 'created_by as "created by"',
  };
}
