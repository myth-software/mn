import { isLastEditedTimeGuard } from '../../guards';

export function assertsIsLastEditedTime(value: unknown): asserts value is {
  last_edited_time: string;
} {
  if (!isLastEditedTimeGuard(value)) {
    console.error(value);
    throw new TypeError('not last edited time');
  }
}
