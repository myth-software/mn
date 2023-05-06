import { isLastEditedByGuard } from '../../guards';

export function assertsIsLasteEditedBy(value: unknown): asserts value is {
  last_edited_by: {
    name: string;
  };
} {
  if (!isLastEditedByGuard(value)) {
    console.error(value);
    throw new TypeError('not last edited by');
  }
}
