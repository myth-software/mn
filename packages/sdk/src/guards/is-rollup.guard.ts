export function isRollupGuard(value: any) {
  if (!value?.rollup) {
    return false;
  }

  return true;
}
