import { Columns, ColumnTypes } from '@mountnotion/types';

/**
 * provides a map of column names to types
 * @param properties notion page response properties
 * @returns mapping of properties to columns
 */
export const createColumns = (
  properties: Record<
    string,
    {
      id: string;
      type: ColumnTypes;
    }
  >
): Columns => {
  return Object.entries(properties).reduce((acc, [property, { type }]) => {
    return {
      ...acc,
      [property]: type,
    };
  }, {} as Columns);
};
