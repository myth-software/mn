export const expandDate = (value: unknown) => {
  if (value !== null) {
    return { date: { start: value } };
  }

  return { date: null };
};
