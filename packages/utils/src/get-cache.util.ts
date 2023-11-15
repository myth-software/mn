import { FlatDatabase } from '@mountnotion/types';
import { readFileSync } from 'fs';
import { CACHE } from './constants.util';
import { log } from './log.util';

export function getCache() {
  let cached;
  try {
    cached = readFileSync(CACHE, 'utf8');
  } catch (error) {
    log.info({ action: 'loading', message: 'no cache found' });
  }

  if (cached) {
    return JSON.parse(cached) as FlatDatabase[];
  }
  return;
}
