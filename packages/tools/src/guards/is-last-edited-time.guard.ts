export function isLastEditedTimeGuard(value: any) {
  if (!value?.last_edited_time) {
    return false;
  }

  return true;
}
