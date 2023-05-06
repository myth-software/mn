export function isCheckboxGuard(value: any) {
  if (typeof value?.checkbox !== 'boolean') {
    return false;
  }

  return true;
}
