import { isStatusGuard } from '../../guards';

export function assertsIsStatus(value: unknown): asserts value is {
  status: { name: string } | null;
} {
  if (!isStatusGuard(value)) {
    console.error(value);
    throw new TypeError('not status');
  }
}
