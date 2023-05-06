export const expandStatus = (value: unknown) => {
  if (value !== null) {
    return { status: { name: value } };
  }

  return { status: null };
};
