import { DateResponse } from '@mountnotion/types';
import { isDateGuard } from '../../guards';

export function assertsIsDate(value: unknown): asserts value is {
  date: DateResponse | null;
} | null {
  if (!isDateGuard(value)) {
    console.error(value);
    throw new TypeError(
      'date must be an object with "start" "end" and "time_zone" properties'
    );
  }
}
