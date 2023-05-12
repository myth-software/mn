import { DatabaseObjectResponse, FlatDatabase } from '@mountnotion/types';
import { createColumns, createOptions, createRelations } from '../utils';
import { flattenCover } from './cover.flattener';
import { flattenDescription } from './description.flattener';
import { flattenIcon } from './icon.flattener';
import { flattenRichText } from './rich-text.flattener';

/**
 *  flattens a notion database response
 * @param database {@link DatabaseObjectResponse}
 * @returns flat database {@link FlatDatabase}
 */
export const flattenDatabaseResponse = ({
  id,
  icon,
  cover,
  description,
  properties,
  title,
}: DatabaseObjectResponse): FlatDatabase => {
  return {
    id,
    icon: flattenIcon(icon),
    cover: flattenCover(cover),
    description: flattenDescription(description),
    title: flattenRichText(title) ?? '',
    columns: createColumns(properties),
    options: createOptions(properties),
    relations: createRelations(properties),
  };
};
