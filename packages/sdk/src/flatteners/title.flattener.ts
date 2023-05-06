export function flattenTitle(
  title: {
    plain_text: string;
  }[]
) {
  if (title.length === 0) {
    return 'untitled';
  }

  return title
    .map(({ plain_text }) => plain_text)
    .join(' ')
    .replace(/(\r\n|\n|\r)/gm, '');
}
