import { isCheckboxGuard } from '../../guards';

export function assertsIsCheckbox(value: unknown): asserts value is {
  checkbox: boolean;
} {
  if (!isCheckboxGuard(value)) {
    console.error(value);
    throw new TypeError('not a checkbox');
  }
}
