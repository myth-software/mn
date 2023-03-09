export function isFormulaGuard(value: any) {
  if (
    !value?.formula?.expression &&
    !value?.formula?.string &&
    !Object.keys(value?.formula).includes('number')
  ) {
    return false;
  }

  return true;
}
