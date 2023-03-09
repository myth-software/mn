export function isTitleGuard(value: any) {
  if (!Array.isArray(value?.title)) {
    return false;
  }

  if (Array.isArray(value?.title) && value?.title.length === 0) {
    return true;
  }

  if (!value?.title?.length && !value.title?.[0]?.plain_text) {
    return false;
  }

  return true;
}
