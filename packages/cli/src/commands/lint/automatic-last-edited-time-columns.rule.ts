import { DatabaseObjectResponse } from '@mountnotion/types';

export function lintColumnsAutomaticLastEditedTime(
  database: DatabaseObjectResponse
) {
  const propertyNames = Object.keys(database.properties);
  const passes = propertyNames.some((name) => {
    return database.properties[name].type === 'last_edited_time';
  });

  return {
    action: passes ? 'pass' : 'fail',
    page: {
      emoji: database.icon?.type === 'emoji' ? database.icon.emoji : '',
      title: database.title[0].plain_text,
    },
    message: passes
      ? 'last_edited_time exists'
      : 'last_edited_time does not exist',
  };
}
