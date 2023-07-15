import { Columns, DatabasePropertyConfigResponse } from '@mountnotion/types';
import { retrieve } from '../infrastructure/pages/properties';

export async function createRollups(
  properties: Record<string, DatabasePropertyConfigResponse>,
  page_id: string
): Promise<Columns> {
  const propertyTypesPromises = Object.entries(properties)
    .filter(([, value]) => value.type === 'rollup')
    .map(([property]) => {
      const { id } = properties[property];
      return retrieve({
        page_id,
        property_id: id,
      });
    });

  const rollupPropertyTypes = await Promise.all(propertyTypesPromises);
  return Object.entries(properties).reduce((acc, [property, value]) => {
    if (value.type !== 'rollup') {
      return acc;
    }

    const propertyType = rollupPropertyTypes.shift();
    if (!propertyType) {
      throw new Error('no property type');
    }

    if (propertyType.object === 'property_item') {
      return {
        ...acc,
        [property]: propertyType.type,
      };
    }
    if (propertyType.object !== 'list') {
      throw new Error('unexpectedly not a list');
    }
    if (propertyType.property_item.type !== 'rollup') {
      throw new Error('unexpectedly not a rollup');
    }

    if (
      propertyType.property_item.rollup.type === 'number' ||
      propertyType.property_item.rollup.type === 'date'
    ) {
      return {
        ...acc,
        [property]: propertyType.property_item.rollup.type,
      };
    }

    const func = propertyType.property_item.rollup.function;
    const isNumber =
      func === 'count' ||
      func === 'count_per_group' ||
      func === 'count_values' ||
      func === 'average' ||
      func === 'max' ||
      func === 'min' ||
      func === 'sum' ||
      func === 'percent_empty' ||
      func === 'percent_not_empty' ||
      func === 'percent_checked' ||
      func === 'percent_per_group' ||
      func === 'percent_unchecked' ||
      func === 'range' ||
      func === 'median';

    if (isNumber) {
      const type = 'number';
      return {
        ...acc,
        [property]: type,
      };
    }
    const isBoolean =
      func === 'checked' ||
      func === 'unchecked' ||
      func === 'empty' ||
      func === 'not_empty' ||
      func === 'unique';
    if (isBoolean) {
      const type = 'checkbox';
      return {
        ...acc,
        [property]: type,
      };
    }
    const isDate =
      func === 'latest_date' ||
      func === 'earliest_date' ||
      func === 'date_range';
    if (isDate) {
      const type = 'date';
      return {
        ...acc,
        [property]: type,
      };
    }

    const result = propertyType.results?.[0];
    if (result) {
      return {
        ...acc,
        [property]: result.type,
      };
    }

    if (func === 'show_unique' || func === 'show_original') {
      const type = 'rollup';
      return {
        ...acc,
        [property]: type,
      };
    }

    console.error(property);
    console.error(propertyType);
    throw new Error('unexpected unhandled rollup');
  }, {} as Columns);
}
