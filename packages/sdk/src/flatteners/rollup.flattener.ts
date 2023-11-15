import {
  assertsIsRollup,
  assertsIsRollupArray,
  assertsIsRollupDate,
  assertsIsRollupNumber,
} from '../assertions';
import {
  isRollupArrayGuard,
  isRollupDateGuard,
  isRollupNumberGuard,
} from '../guards';
import { flattenDate } from './date.flattener';
import { flattenNotionProperty } from './notion-property.flattener';

export function flattenRollup(notionProperty: unknown): any {
  assertsIsRollup(notionProperty);

  if (isRollupArrayGuard(notionProperty)) {
    assertsIsRollupArray(notionProperty);
    const array = notionProperty.rollup.array;

    return array.length === 0 ? null : flattenNotionProperty(array[0]);
  }

  if (isRollupNumberGuard(notionProperty)) {
    assertsIsRollupNumber(notionProperty);
    const number = notionProperty.rollup.number;

    return number;
  }

  if (isRollupDateGuard(notionProperty)) {
    assertsIsRollupDate(notionProperty);
    const date = flattenDate(notionProperty.rollup.date);

    return date;
  }

  return notionProperty.rollup;
}
