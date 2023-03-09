export function isRollupNumberGuard(value: any) {
  if (value?.rollup?.type !== 'number') {
    return false;
  }

  return true;
}
