import { Columns, PageObjectResponse } from '@mountnotion/types';
import { createColumns } from '../utils';
import { flattenCover } from './cover.flattener';
import { flattenIcon } from './icon.flattener';
import { flattenNotionProperty } from './notion-property.flattener';

/**
 *  flattens a notion page response to a tuple of the cache and mapping of keys to columns
 * @param page PageObjectResponse
 * @returns [TCache, Columns]
 */
export const flattenPageResponse = <TCache>({
  id,
  properties,
  icon,
  cover,
}: PageObjectResponse): [TCache, Columns] => {
  const flat: {
    [key: string]: unknown;
  } = {
    id,
    icon: flattenIcon(icon),
    cover: flattenCover(cover),
  };
  for (const property in properties) {
    const instance = properties[property];

    flat[property] = flattenNotionProperty(instance);
  }
  const columns = createColumns(properties);
  const values = flat as unknown as TCache;
  return [values, columns];
};
