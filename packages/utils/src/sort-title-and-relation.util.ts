export function sortTitleAndRelation(
  tuple: [baseTitle: string, relationColumn: string]
) {
  return tuple.sort((a, b) => a.localeCompare(b));
}
