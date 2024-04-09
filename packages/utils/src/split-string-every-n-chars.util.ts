export function splitStringEveryNChars(
  input: string,
  interval: number = 2000
): string[] {
  const result: string[] = [];
  for (let i = 0; i < input.length; i += interval) {
    result.push(input.substring(i, i + interval));
  }
  return result;
}
