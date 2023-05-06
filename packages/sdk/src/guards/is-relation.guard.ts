export function isRelationGuard(value: any) {
  if (value?.relation?.length === 0) {
    return true;
  }

  if (!value.relation?.[0]?.id) {
    return false;
  }

  return true;
}
