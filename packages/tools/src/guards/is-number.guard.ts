export function isNumberGuard(value: any) {
  if (!value?.number) {
    return true;
  }

  if (Number.isNaN(value?.number)) {
    return false;
  }

  return true;
}
