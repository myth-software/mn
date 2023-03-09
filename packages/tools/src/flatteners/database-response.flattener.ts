import { DatabaseObjectResponse, FlatDatabase } from '@mountnotion/types';
import { createColumns } from '../utils';
import { flattenCover } from './cover.flattener';
import { flattenDescription } from './description.flattener';
import { flattenIcon } from './icon.flattener';
import { flattenRichText } from './rich-text.flattener';

/**
 *  flattens a notion page response to a tuple of the entity and mapping of keys to columns
 * @param database {@link DatabaseObjectResponse}
 * @returns flattened database
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
    columns: createColumns(properties),
    title: flattenRichText(title),
    options: {},
  };
};
