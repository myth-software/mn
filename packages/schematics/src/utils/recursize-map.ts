/* eslint-disable @typescript-eslint/no-explicit-any */
export function recursiveMap(obj: any) {
  const outer: any = [];
  const strings: any[] = [];

  // Use Object.entries() to get an array of the object's key-value pairs
  Object.entries(obj).forEach(([key, val]) => {
    // If the value is an object, recursively call the function with that object as the new argument
    if (typeof val === 'object') {
      outer.push([key, recursiveMap(val)]);
    }
    // If the value is not an object, call the callback function with that value as the argument,
    // and assign the result of the callback to the property
    else {
      strings.push(val);
    }
  });

  if (strings.length > 0) {
    return strings;
  }

  // Return the mapped object
  return outer;
}
