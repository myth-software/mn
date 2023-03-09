export function isFilesGuard(value: any) {
  if (value?.files?.length === 0) {
    return true;
  }
  if (!value.files?.[0]?.file && !value.files?.[0]?.external) {
    return false;
  }

  return true;
}
