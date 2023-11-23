import { isPeopleGuard } from '../../guards';

export function assertsIsPeople(value: unknown): asserts value is {
  people: {
    id: string;
    name?: string;
  }[];
} {
  if (!isPeopleGuard(value)) {
    console.error(value);
    throw new TypeError('not people');
  }
}
