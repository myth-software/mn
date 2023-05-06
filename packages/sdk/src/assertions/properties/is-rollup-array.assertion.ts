import { isRollupArrayGuard } from '../../guards';

export function assertsIsRollupArray(value: unknown): asserts value is {
  rollup: { type: 'array'; array: any[] };
} {
  if (!isRollupArrayGuard(value)) {
    throw new TypeError('not an array rollup');
  }
}
