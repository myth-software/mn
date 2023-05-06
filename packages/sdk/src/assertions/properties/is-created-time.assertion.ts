import { isCreatedTimeGuard } from '../../guards';

export function assertsIsCreatedTime(value: unknown): asserts value is {
  created_time: string;
} {
  if (!isCreatedTimeGuard(value)) {
    console.error(value);
    throw new TypeError('not created time');
  }
}
