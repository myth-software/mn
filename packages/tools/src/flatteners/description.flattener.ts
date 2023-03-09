/**
 * flattens a notion database description
 * @param description notion description array
 * @returns plain text of description
 */
export function flattenDescription(
  description: {
    plain_text: string;
  }[]
) {
  if (description.length === 0) {
    return null;
  }

  return description
    .map(({ plain_text }) => plain_text)
    .join(' ')
    .replace(/(\r\n|\n|\r)/gm, '');
}
