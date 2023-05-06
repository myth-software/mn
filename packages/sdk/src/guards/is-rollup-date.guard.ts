export function isRollupDateGuard(value: any) {
  if (value?.rollup?.type !== 'date') {
    return false;
  }

  return true;
}
