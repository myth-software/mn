import { ColumnTypes, Mappings } from '@mountnotion/types';
import { camelize } from './strings.util';

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
  const nonAlphabet = /[^a-zA-Z ]/g;
  const punctuation = /[?.,/#!$%^&*;:{}=\-_`~()]/g;
  return Object.entries(properties).reduce((acc, [property]) => {
    const propertyWithoutEmoji = property
      .replace(nonAlphabet, '')
      .replace(punctuation, '');
    return {
      ...acc,
      [property]: camelize(propertyWithoutEmoji),
    };
  }, {} as Mappings);
};
