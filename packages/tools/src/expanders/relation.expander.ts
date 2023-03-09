export const expandRelation = (value: unknown) => {
  if (Array.isArray(value)) {
    return { relation: value.map((id) => ({ id })) };
  }

  return { relation: [] };
};
