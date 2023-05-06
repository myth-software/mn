export function isCreatedByGuard(value: any) {
  if (!value?.created_by?.name) {
    return false;
  }

  return true;
}
