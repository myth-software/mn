import { DateResponse } from '@mountnotion/types';
import { isRollupDateGuard } from '../../guards';

export function assertsIsRollupDate(value: unknown): asserts value is {
  rollup: { type: 'date'; date: DateResponse | null };
} {
  if (!isRollupDateGuard(value)) {
    throw new TypeError('not a date rollup');
  }
}
