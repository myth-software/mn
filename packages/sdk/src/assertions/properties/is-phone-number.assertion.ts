import { isPhoneNumberGuard } from '../../guards';

export function assertsIsPhoneNumber(value: unknown): asserts value is {
  phone_number: string | null;
} {
  if (!isPhoneNumberGuard(value)) {
    console.error(value);
    throw new TypeError('not phone number');
  }
}
