/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 *
 * @param input english language original array from recursive map
 * @param output translated language array
 * @returns locale object
 */
export function recursiveZip(input: any[], output: any[]): any {
  if (!Array.isArray(input)) {
    throw new Error('recursiveZip input must be an array');
  }

  if (!Array.isArray(output)) {
    throw new Error('recursiveZip output must be an array');
  }

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

    return {
      ...acc,
      [key]: inputVal.reduce((e: any, c: any, j: number) => {
        return { ...e, [c]: outputVal[j] };
      }, {}),
    };
  }, {});
}
