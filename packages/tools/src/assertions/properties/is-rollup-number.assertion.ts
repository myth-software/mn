import { isRollupNumberGuard } from '../../guards';

export function assertsIsRollupNumber(value: unknown): asserts value is {
  rollup: { type: 'number'; number: number | null };
} {
  if (!isRollupNumberGuard(value)) {
    throw new TypeError('not a number rollup');
  }
}
