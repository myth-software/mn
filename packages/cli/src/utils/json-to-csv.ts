import { AdditionalPropertyTypes } from '@mountnotion/types';
import { writeFileSync } from 'fs';

/**
 * @returns string representing csv
 */
export function convertToCSV<T extends Record<string, unknown>>(
  headers: T,
  items: T[]
) {
  let str = '';

  const headerKeys = Object.keys(headers);

  str += headerKeys.join(',') + '\r\n';

  items.forEach((item) => {
    const itemStr = headerKeys.map((header) => item[header]).join(',') + '\r\n';
    str += itemStr;
  });

  return str;
}

export function exportCSVFile<
  T extends Record<string, unknown>,
  K extends {
    -readonly [P in keyof T as P extends AdditionalPropertyTypes
      ? never
      : P]: string;
  }
>(headers: K, items: T[], fileTitle: string) {
  const headersWithId = { ...headers, id: 'id' } as unknown as T;

  // Convert Object to JSON
  const csv = convertToCSV(headersWithId, items);
  const exportedFilename = fileTitle.replace(' ', '_') + '.csv';
  writeFileSync(exportedFilename, csv);
}
