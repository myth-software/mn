import { Schema } from '@mountnotion/types';
import { readFileSync } from 'fs';
import { SCHEMA } from './constants.util';
import { log } from './log.util';

export function getSchema() {
  let schemad;
  try {
    schemad = readFileSync(SCHEMA, 'utf8');
  } catch (error) {
    log.info({ action: 'loading', message: 'no schema found' });
  }

  if (schemad) {
    return JSON.parse(schemad) as Schema[];
  }
  return;
}
