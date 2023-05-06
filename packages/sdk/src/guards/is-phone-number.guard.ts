export function isPhoneNumberGuard(value: any) {
  if (!value?.phone_number) {
    return true;
  }

  if (typeof value?.phone_number !== 'string') {
    return false;
  }

  return true;
}
