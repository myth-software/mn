import { isSelectGuard } from '../../guards';

export function assertsIsSelect(value: unknown): asserts value is {
  select: { name: string } | null;
} {
  if (!isSelectGuard(value)) {
    console.error(value);
    throw new TypeError('not select');
  }
}
