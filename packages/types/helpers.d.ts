/**
 * recursively makes type readonly
 */
export declare type DeepReadonly<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};

/**
 * merges two types
 *
 * credit: {@link https://github.com/microsoft/TypeScript/issues/32689#issuecomment-517933876}
 */
type Merge<A, B> = {
  [K in keyof A]: K extends keyof B ? B[K] : A[K];
} & B extends infer O
  ? { [K in keyof O]: O[K] }
  : never;
