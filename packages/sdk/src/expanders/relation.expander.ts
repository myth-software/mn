export const expandRelation = (value: unknown) => {
  if (Array.isArray(value)) {
    return { relation: value.filter((id) => id).map((id) => ({ id })) };
  }
  if (typeof value === 'string' && value) {
    return { relation: [{ id: value }] };
  }

  return { relation: [] };
};
