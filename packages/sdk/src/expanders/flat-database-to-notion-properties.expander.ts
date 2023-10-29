import { NewFlatDatabase, NotionProperties } from '@mountnotion/types';

export function expandFlatDatabaseToNotionProperties(flat: NewFlatDatabase) {
  const properties: NotionProperties = {};

  for (const [key, value] of Object.entries(flat.columns)) {
    properties[key] = {};
    properties[key][value] = {};
    if (flat.options?.[key]) {
      const arr = flat.options[key];
      properties[key][value].options = arr?.map((str) => ({ name: str }));
    }
  }
  return properties;
}
