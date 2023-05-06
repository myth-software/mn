import { isMultiSelectGuard } from '../../guards';

export function assertsIsMultiSelect(
  value: unknown
): asserts value is { multi_select: { name: string }[] } {
  if (!isMultiSelectGuard(value)) {
    console.error(value);
    throw new TypeError(
      'multi_select must be an array of object with "name" property'
    );
  }
}
