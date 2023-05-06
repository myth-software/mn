import { isTitleGuard } from '../../guards';

export function assertsIsTitle(value: unknown): asserts value is {
  title: {
    plain_text: string;
  }[];
} {
  if (!isTitleGuard(value)) {
    console.error(value);
    throw new TypeError('not title');
  }
}
