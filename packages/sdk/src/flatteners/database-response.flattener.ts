import { Cache, DatabaseObjectResponse } from '@mountnotion/types';
import { ensure } from '@mountnotion/utils';
import { createColumns, createMappings, createOptions } from '../utils';
import { createSyncedColumns } from '../utils/create-synced-property.util';
import { flattenCover } from './cover.flattener';
import { flattenDescription } from './description.flattener';
import { flattenIcon } from './icon.flattener';
import { flattenRichText } from './rich-text.flattener';

/**
 *  flattens a notion database response
 * @param database {@link DatabaseObjectResponse}
 * @param options {@link BasicOptions}
 * @returns flat database {@link Cache}
 */
export const flattenDatabaseResponse = ({
  id,
  icon,
  cover,
  description,
  properties,
  title,
}: DatabaseObjectResponse): Cache => {
  return {
    id,
    icon: flattenIcon(icon),
    cover: flattenCover(cover),
    description: flattenDescription(description),
    title: ensure(flattenRichText(title)),
    columns: createColumns(properties),
    options: createOptions(properties),
    mappings: createMappings(properties),
    syncedColumns: createSyncedColumns(properties),
    relations: null,
    rollups: null,
    rollupsOptions: null,
  };
};
