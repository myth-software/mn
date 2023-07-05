import { DatabaseObjectResponse } from '@mountnotion/types';

export function lintColumnsConsistentLastEditedBy(
  database: DatabaseObjectResponse
) {
  const propertyNames = Object.keys(database.properties);
  const lastEditedBy = propertyNames.find((name) => {
    return database.properties[name].type === 'last_edited_by';
  });
  const passes = lastEditedBy && lastEditedBy === 'last edited by';

  return {
    action: passes ? 'pass' : 'fail',
    page: {
      emoji: database.icon?.type === 'emoji' ? database.icon.emoji : '',
      title: database.title[0].plain_text,
    },
    message: passes
      ? `last_edited_by "${lastEditedBy}" has consistent column name as "last edited by"`
      : `last_edited_by "${lastEditedBy}" does not have consistent column name as "last edited by"`,
  };
}
