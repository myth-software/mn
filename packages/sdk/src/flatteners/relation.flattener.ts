export function flattenRelation(
  relation: {
    id: string;
  }[]
) {
  if (relation.length === 0) {
    return null;
  }

  return relation.map(({ id }) => id);
}
