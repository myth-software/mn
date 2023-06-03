/**
 * sorts the keys of the given object.
 * @returns a new object instance with sorted keys
 * @credit https://github.com/angular/components/blob/710873433d83a5f9e9f6f02adfe3cfe4e2667c53/src/cdk/schematics/ng-add/package-config.ts#L19
 */
export function sortObjectByKeys(obj: Record<string, string>) {
  return Object.keys(obj)
    .sort()
    .reduce((result, key) => {
      result[key] = obj[key];
      return result;
    }, {} as Record<string, string>);
}
