import { DateResponse } from '@mountnotion/types';

export function flattenDate(date: DateResponse | null) {
  if (date === null) {
    return date;
  }

  const isRange = date.start && date.end;

  if (isRange) {
    return `${date.start}/${date.end}`;
  }

  if (date.start) {
    return date.start;
  }

  return date.end;
}
