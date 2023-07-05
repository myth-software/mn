import { DatabaseObjectResponse } from '@mountnotion/types';

export function lintColumnsConsistentCreatedTime(
  database: DatabaseObjectResponse
) {
  const propertyNames = Object.keys(database.properties);
  const createdTime = propertyNames.find((name) => {
    return database.properties[name].type === 'created_time';
  });
  const passes = createdTime && createdTime === 'created time';

  return {
    action: passes ? 'pass' : 'fail',
    page: {
      emoji: database.icon?.type === 'emoji' ? database.icon.emoji : '',
      title: database.title[0].plain_text,
    },
    message: passes
      ? `created_time "${createdTime}" has consistent column name as "created time"`
      : `created_time "${createdTime}" does not have consistent column name as "created time"`,
  };
}
