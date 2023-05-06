export function isEmailGuard(value: any) {
  if (!value?.email) {
    return true;
  }

  if (typeof value?.email !== 'string') {
    return false;
  }

  return true;
}
