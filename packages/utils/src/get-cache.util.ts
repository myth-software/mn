import { Cache } from '@mountnotion/types';
import { readFileSync } from 'fs';
import { CACHE } from './constants.util';
import { log } from './log.util';

export function getCache() {
  let cached;
  try {
    cached = readFileSync(CACHE, 'utf8');
    log.info({ action: 'loading', message: 'data from filesystem cache' });
  } catch (error) {
    log.info({ action: 'loading', message: 'no cache found' });
  }

  if (cached) {
    return JSON.parse(cached) as Cache[];
  }
  return;
}
