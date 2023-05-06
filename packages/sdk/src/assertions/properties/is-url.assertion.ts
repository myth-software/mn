import { isUrlGuard } from '../../guards';

export function assertsIsUrl(value: unknown): asserts value is {
  url: string | null;
} {
  if (!isUrlGuard(value)) {
    console.error(value);
    throw new TypeError('not url');
  }
}
