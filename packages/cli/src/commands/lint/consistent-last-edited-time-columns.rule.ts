import { DatabaseObjectResponse } from '@mountnotion/types';

export function lintColumnsConsistentLastEditedTime(
  database: DatabaseObjectResponse
) {
  const propertyNames = Object.keys(database.properties);
  const lastEditedTime = propertyNames.find((name) => {
    return database.properties[name].type === 'last_edited_time';
  });
  const passes = lastEditedTime && lastEditedTime === 'last edited time';

  return {
    action: passes ? 'pass' : 'fail',
    page: {
      emoji: database.icon?.type === 'emoji' ? database.icon.emoji : '',
      title: database.title[0].plain_text,
    },
    message: passes
      ? `last_edited_time "${lastEditedTime}" has consistent column name as "last edited time"`
      : `last_edited_time "${lastEditedTime}" does not have consistent column name as "last edited time"`,
  };
}
