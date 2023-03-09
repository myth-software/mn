import { Columns, PageObjectResponse } from '@mountnotion/types';

/**
 * provides a map of column names to types
 * @param properties notion page response properties
 * @returns mapping of properties to columns
 */
export const createColumns = (
  properties: PageObjectResponse['properties']
): Columns => {
  return Object.keys(properties).reduce((acc, property) => {
    const { type } = properties[property];
    return {
      ...acc,
      [property]: type,
    };
  }, {} as Columns);
};
