import { Columns, PageObjectResponse } from '@mountnotion/types';
import { createColumns } from '../utils';
import { flattenCover } from './cover.flattener';
import { flattenIcon } from './icon.flattener';
import { flattenNotionProperty } from './notion-property.flattener';

/**
 *  flattens a notion page response to a tuple of the schema and mapping of keys to columns
 * @param page PageObjectResponse
 * @returns [TSchema, Columns]
 */
export const flattenPageResponse = <TSchema>({
  id,
  properties,
  icon,
  cover,
}: PageObjectResponse): [TSchema, Columns] => {
  const schema: {
    [key: string]: unknown;
  } = {
    id,
    icon: flattenIcon(icon),
    cover: flattenCover(cover),
  };
  for (const property in properties) {
    const instance = properties[property];

    schema[property] = flattenNotionProperty(instance);
  }
  const columns = createColumns(properties);
  const values = schema as unknown as TSchema;
  return [values, columns];
};
