/**
 * flip swaps keys for values and values for keys on an object
 * @param data
 * @returns flipped data
 */
export const flip = (data: object) =>
  Object.fromEntries(Object.entries(data).map(([key, value]) => [value, key]));
