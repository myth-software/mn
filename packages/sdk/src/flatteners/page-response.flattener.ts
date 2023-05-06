import { Columns, PageObjectResponse } from '@mountnotion/types';
import { createColumns } from '../utils';
import { flattenCover } from './cover.flattener';
import { flattenIcon } from './icon.flattener';
import { flattenNotionProperty } from './notion-property.flattener';

/**
 *  flattens a notion page response to a tuple of the entity and mapping of keys to columns
 * @param page PageObjectResponse
 * @returns [Entity, Columns]
 */
export const flattenPageResponse = <Entity>({
  id,
  properties,
  icon,
  cover,
}: PageObjectResponse): [Entity, Columns] => {
  const flat: {
    [key: string]: unknown;
  } = {
    id,
    icon: flattenIcon(icon),
    cover: flattenCover(cover),
  };
  for (const property in properties) {
    const entity = properties[property];

    flat[property] = flattenNotionProperty(entity);
  }
  const columns = createColumns(properties);
  const values = flat as unknown as Entity;
  return [values, columns];
};
