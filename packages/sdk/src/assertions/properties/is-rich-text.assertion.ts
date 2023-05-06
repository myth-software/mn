import { isRichTextGuard } from '../../guards';

export function assertsIsRichText(value: unknown): asserts value is {
  rich_text: {
    plain_text: string;
  }[];
} {
  if (!isRichTextGuard(value)) {
    console.error(value);
    throw new TypeError('not rich text');
  }
}
