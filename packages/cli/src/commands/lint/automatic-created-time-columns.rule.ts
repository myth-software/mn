import { DatabaseObjectResponse } from '@mountnotion/types';

export function lintColumnsAutomaticCreatedTime(
  database: DatabaseObjectResponse
) {
  const propertyNames = Object.keys(database.properties);
  const passes = propertyNames.some((name) => {
    return database.properties[name].type === 'created_time';
  });

  return {
    action: passes ? 'pass' : 'fail',
    page: {
      emoji: database.icon?.type === 'emoji' ? database.icon.emoji : '',
      title: database.title[0].plain_text,
    },
    message: passes ? 'created_time exists' : 'created_time does not exist',
  };
}
