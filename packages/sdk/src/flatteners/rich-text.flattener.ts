export function flattenRichText(
  rich_text: {
    plain_text: string;
  }[]
) {
  if (rich_text.length === 0) {
    return null;
  }

  return rich_text
    .map(({ plain_text }) => plain_text)
    .join(' ')
    .replace(/(\r\n|\n|\r)/gm, '');
}
