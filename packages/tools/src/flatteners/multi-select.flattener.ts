export function flattenMultiSelect(
  multi_select: {
    name: string;
  }[]
) {
  if (multi_select.length === 0) {
    return null;
  }

  return multi_select.map(({ name }) => name);
}
