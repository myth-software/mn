import { camelize } from '@angular-devkit/core/src/utils/strings';
import { ColumnTypes, Mappings } from '@mountnotion/types';

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
  const emojiRegex =
    /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g;
  return Object.entries(properties).reduce((acc, [property]) => {
    const propertyWithoutEmoji = property.replace(emojiRegex, '');
    return {
      ...acc,
      [property]: camelize(propertyWithoutEmoji),
    };
  }, {} as Mappings);
};
