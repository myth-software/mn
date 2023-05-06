import { isEmailGuard } from '../../guards';

export function assertsIsEmail(value: unknown): asserts value is {
  email: string;
} {
  if (!isEmailGuard(value)) {
    console.error(value);
    throw new TypeError('not an email');
  }
}
