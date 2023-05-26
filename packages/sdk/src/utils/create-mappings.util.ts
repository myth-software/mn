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
  const emoji =
    /([\u2700-\u27BF]|uFE0F|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]|[\p{N}\p{Z}^$\n])/g;
  const punctuation = /[?.,/#!$%^&*;:{}=\-_`~()]/g;
  return Object.entries(properties).reduce((acc, [property]) => {
    const propertyWithoutEmoji = property
      .replace(emoji, '')
      .replace(punctuation, '');
    return {
      ...acc,
      [property]: camelize(propertyWithoutEmoji),
    };
  }, {} as Mappings);
};
