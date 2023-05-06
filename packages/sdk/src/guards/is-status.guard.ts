export function isStatusGuard(value: any) {
  if (!value?.status) {
    return true;
  }

  if (!value?.status?.name) {
    return false;
  }

  return true;
}
