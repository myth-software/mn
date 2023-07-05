import { DatabaseObjectResponse } from '@mountnotion/types';

export function lintColumnsConsistentCreatedBy(
  database: DatabaseObjectResponse
) {
  const propertyNames = Object.keys(database.properties);
  const createdBy = propertyNames.find((name) => {
    return database.properties[name].type === 'created_by';
  });
  const passes = createdBy && createdBy === 'created by';

  return {
    action: passes ? 'pass' : 'fail',
    page: {
      emoji: database.icon?.type === 'emoji' ? database.icon.emoji : '',
      title: database.title[0].plain_text,
    },
    message: passes
      ? `created_by "${createdBy}" has consistent column name as "created by"`
      : `created_by "${createdBy}" does not have consistent column name as "created by"`,
  };
}
