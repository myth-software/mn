import { Fix } from '@mountnotion/types';
import { readFileSync } from 'fs';
import { COLUMNS_LINT } from './constants.util';
import { log } from './log.util';

export function getLintColumns() {
  let cached;
  try {
    cached = readFileSync(COLUMNS_LINT, 'utf8');
  } catch (error) {
    log.info({ action: 'loading', message: 'no columns lint found' });
  }

  if (cached) {
    return JSON.parse(cached) as Array<Fix>;
  }
  return;
}
