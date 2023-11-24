import { Fix } from '@mountnotion/types';
import { readFileSync } from 'fs';
import { COLUMNS_LINT } from './constants.util';
import { log } from './log.util';

export function getLintColumns() {
  let schemad;
  try {
    schemad = readFileSync(COLUMNS_LINT, 'utf8');
  } catch (error) {
    log.info({ action: 'loading', message: 'no columns lint found' });
  }

  if (schemad) {
    return JSON.parse(schemad) as Array<Fix>;
  }
  return;
}
