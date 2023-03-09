export function isCreatedTimeGuard(value: any) {
  if (!value?.created_time) {
    return false;
  }

  return true;
}
