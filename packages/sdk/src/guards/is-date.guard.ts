export function isDateGuard(value: any) {
  if (!value?.date) {
    return true;
  }

  const hasCorrectProperties = (value: object) =>
    value.hasOwnProperty('start') &&
    value.hasOwnProperty('end') &&
    value.hasOwnProperty('time_zone');

  if (typeof value !== 'object') {
    return false;
  }

  if (!hasCorrectProperties(value?.date)) {
    return false;
  }

  return true;
}
