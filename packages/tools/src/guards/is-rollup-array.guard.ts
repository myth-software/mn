export function isRollupArrayGuard(value: any) {
  if (value?.rollup?.type !== 'array') {
    return false;
  }

  return true;
}
