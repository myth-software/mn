/* eslint-disable @typescript-eslint/no-explicit-any */
export function recursiveZip(input: any[], output: any[]): any {
  // Use Object.entries() to get an array of the object's key-value pairs
  return input.reduce((acc, currentInput, i) => {
    const [key, inputVal] = currentInput;
    const [, outputVal] = output[i];
    const isStrings = typeof inputVal[0] === 'string';

    if (!isStrings) {
      return {
        ...acc,
        [key]: recursiveZip(inputVal, outputVal),
      };
    }

    // If the value is not an object, call the callback function with that value as the argument,
    // and assign the result of the callback to the property

    return {
      ...acc,
      [key]: inputVal.reduce((e: any, c: any, j: number) => {
        return { ...e, [c]: outputVal[j] };
      }, {}),
    };
  }, {});
}
