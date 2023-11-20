export default function removeFalsyValues(
  obj: Record<string, any>
): Record<string, any> {
  const newObj: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value) && value.length !== 0) {
      newObj[key] = value.filter((v) => v);
    } else if (Array.isArray(value)) {
      newObj[key] = null;
    } else {
      newObj[key] = value;
    }
  }

  return newObj;
}
