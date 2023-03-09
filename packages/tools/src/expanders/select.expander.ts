export const expandSelect = (value: unknown) => {
  if (value !== null) {
    return { select: { name: value } };
  }

  return { select: null };
};
