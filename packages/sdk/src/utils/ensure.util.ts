/**
 *
 * credit: @link https://mikecann.co.uk/posts/the-typescript-utils-i-cant-live-without
 */
export const ensure = <T>(
  obj: T | null | undefined,
  err = `variable was null or undefined when it shouldnt have been.`
): T => {
  if (obj === null) throw new Error(err);
  if (obj === undefined) throw new Error(err);
  return obj;
};
