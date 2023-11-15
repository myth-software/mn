interface NormalizedData<T> {
  byId: { [id: string]: T };
  allIds: string[];
}

export function normalizeArray<T extends { [key: string]: any }>(
  arr: T[],
  idKey: keyof T
): NormalizedData<T> {
  const byId: { [id: string]: T } = {};
  const allIds: string[] = [];

  arr.forEach((item) => {
    const id = item[idKey];
    byId[id] = item;
    allIds.push(id.toString());
  });
  const allUniqueIds = [...new Set(allIds)];

  return { byId, allIds: allUniqueIds };
}
