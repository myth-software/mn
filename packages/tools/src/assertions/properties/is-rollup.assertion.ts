import { isRollupGuard } from '../../guards';

export function assertsIsRollup(value: unknown): asserts value is {
  rollup: {
    function: string;
  };
} {
  if (!isRollupGuard(value)) {
    console.error(value);
    throw new TypeError('not rollup');
  }
}
