/* eslint-disable @typescript-eslint/no-explicit-any */
export function recursiveMap(obj: any) {
  if (typeof obj !== 'object') {
    throw new Error('cannot recursive map, obj is not an object');
  }
  /**
   * the empty array outer holds a tuple of a string identifying the key for
   * the property and the array of strings in the inner object
   */
  const outer: any = [];
  /**
   * the array of strings that map to a translation
   */
  const strings: any[] = [];

  Object.entries(obj).forEach(([key, val]) => {
    /**
     * if the value is an object the recurse until the value is a string
     */
    if (typeof val === 'object') {
      outer.push([key, recursiveMap(val)]);
    } else {
      /**
       * when the value is a string then push the value
       */
      strings.push(val);
    }
  });

  /**
   * when there are strings return them
   */
  if (strings.length > 0) {
    return strings;
  }

  /**
   * return the mapped object
   */
  return outer;
}
