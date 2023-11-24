export function isFormulaGuard(value: any) {
  if (
    !value?.formula?.date &&
    !value?.formula?.expression &&
    value?.formula?.type !== 'string' &&
    !Object.keys(value?.formula).includes('number')
  ) {
    return false;
  }

  return true;
}
