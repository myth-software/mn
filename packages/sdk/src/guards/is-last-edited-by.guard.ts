export function isLastEditedByGuard(value: any) {
  if (!value?.last_edited_by?.name) {
    return false;
  }

  return true;
}
