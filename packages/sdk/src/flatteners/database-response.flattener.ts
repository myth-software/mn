import {
  BasicOptions,
  DatabaseObjectResponse,
  FlatDatabase,
} from '@mountnotion/types';
import { ensure } from '@mountnotion/utils';
import { createColumns, createMappings, createOptions } from '../utils';
import { flattenCover } from './cover.flattener';
import { flattenDescription } from './description.flattener';
import { flattenIcon } from './icon.flattener';
import { flattenRichText } from './rich-text.flattener';

/**
 *  flattens a notion database response
 * @param database {@link DatabaseObjectResponse}
 * @param options {@link BasicOptions}
 * @returns flat database {@link FlatDatabase}
 */
export const flattenDatabaseResponse = (
  { id, icon, cover, description, properties, title }: DatabaseObjectResponse,
  options?: BasicOptions
): FlatDatabase => {
  return {
    id,
    icon: flattenIcon(icon),
    cover: flattenCover(cover),
    description: flattenDescription(description),
    title: ensure(flattenRichText(title)),
    columns: createColumns(properties),
    options: createOptions(properties),
    relations: null,
    mappings: createMappings(properties, options),
    rollups: null,
    rollupsOptions: null,
  };
};
