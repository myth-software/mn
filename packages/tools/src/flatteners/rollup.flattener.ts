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

export function flattenRollup(entity: unknown): any {
  assertsIsRollup(entity);

  if (isRollupArrayGuard(entity)) {
    assertsIsRollupArray(entity);
    const array = entity.rollup.array;

    return array.length === 0 ? null : flattenNotionProperty(array[0]);
  }

  if (isRollupNumberGuard(entity)) {
    assertsIsRollupNumber(entity);
    const number = entity.rollup.number;

    return number;
  }

  if (isRollupDateGuard(entity)) {
    assertsIsRollupDate(entity);
    const date = flattenDate(entity.rollup.date);

    return date;
  }

  return entity.rollup;
}
