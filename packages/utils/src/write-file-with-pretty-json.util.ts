import { writeFileSync } from 'fs';
import { prettify } from './prettify.util';

export function writeFileWithPrettyJson(path: string, obj: object) {
  const prettyJson = prettify(path, JSON.stringify(obj));
  writeFileSync(path, prettyJson);
}
