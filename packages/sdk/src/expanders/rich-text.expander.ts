import { splitStringEveryNChars } from '@mountnotion/utils';

export const expandRichText = (value: unknown) => {
  if (value !== null) {
    return {
      rich_text: splitStringEveryNChars(value as string, 2000).map((chunk) => ({
        type: 'text',
        text: {
          content: chunk,
        },
      })),
    };
  }

  return { rich_text: [] };
};
