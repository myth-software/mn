export function isUrlGuard(value: any) {
  if (!value?.url) {
    return true;
  }

  if (typeof value?.url !== 'string') {
    return false;
  }

  return true;
}
