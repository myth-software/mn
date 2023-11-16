/**
 * A utility type that flips the keys and values of a given object type.
 *
 * @template TObject - The object type to flip.
 */
type Flip<TObject extends Record<string, string>> = {
  [Key in TObject[keyof TObject]]: {
    [Value in keyof TObject]: TObject[Value] extends Key ? Value : never;
  }[keyof TObject];
};

/**
 * flip
 * @param data - The object to flip.
 * @returns a new object with keys and values flipped.
 */
export function flip<T extends Record<string, string>>(data: T): Flip<T> {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [value, key])
  ) as Flip<T>;
}
