export function isPeopleGuard(value: any) {
  if (!Array.isArray(value?.people)) {
    return false;
  }

  if (value?.people?.length === 0) {
    return true;
  }

  if (!value.people?.[0]?.name) {
    return false;
  }

  return true;
}
