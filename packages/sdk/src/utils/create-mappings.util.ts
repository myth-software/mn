import { ColumnTypes, Mappings } from '@mountnotion/types';
import { variablize } from '@mountnotion/utils';

/**
 * provides a map of column names to javascript properties
 * @param properties notion page response properties
 * @returns mapping of properties to columns
 */
export const createMappings = (
  properties: Record<
    string,
    {
      id: string;
      type: ColumnTypes;
    }
  >
): Mappings => {
  return Object.entries(properties).reduce((acc, [property]) => {
    return {
      ...acc,
      [variablize(property)]: property,
    };
  }, {} as Mappings);
};
