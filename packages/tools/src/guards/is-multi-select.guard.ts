export function isMultiSelectGuard(value: any) {
  if (value?.multi_select?.length === 0) {
    return true;
  }

  if (!value?.multi_select?.[0]?.name) {
    return false;
  }

  return true;
}
