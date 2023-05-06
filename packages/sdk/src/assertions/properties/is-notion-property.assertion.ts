import { Columns } from '@mountnotion/types';
import { isPropertiesGuard } from '../../guards';

export function assertsIsNotionProperty(
  value: unknown
): asserts value is Columns {
  if (!isPropertiesGuard(value)) {
    console.error(value);
    throw new TypeError('property must have "type" key');
  }
}
