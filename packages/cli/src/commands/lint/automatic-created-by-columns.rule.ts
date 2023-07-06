import { DatabaseObjectResponse } from '@mountnotion/types';

export function lintColumnsAutomaticCreatedBy(
  database: DatabaseObjectResponse
) {
  const propertyNames = Object.keys(database.properties);
  const passes = propertyNames.some((name) => {
    return database.properties[name].type === 'created_by';
  });

  return {
    action: passes ? 'pass' : 'fail',
    page: {
      emoji: database.icon?.type === 'emoji' ? database.icon.emoji : '',
      title: database.title[0].plain_text,
    },
    message: passes ? 'created_by exists' : 'created_by does not exist',
  };
}
