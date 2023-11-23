import { MountNotionConfig } from '@mountnotion/types';
import { readFileSync, writeFileSync } from 'fs';

export default function ensureMnJson(configFile: string) {
  // Check if .mountnotion is included in .gitignore
  if (!configFile) {
    // Create mn.json file with an empty object
    writeFileSync(configFile, '{}');
  }

  const content = JSON.parse(
    readFileSync(configFile, 'utf-8')
  ) as MountNotionConfig;

  return content;
}
