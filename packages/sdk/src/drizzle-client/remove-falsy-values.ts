export default function removeFalsyValues(
  obj: Record<string, any>
): Record<string, any> {
  const newObj: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      newObj[key] = value.filter((v) => v);
    } else {
      newObj[key] = value;
    }
  }

  return newObj;
}
