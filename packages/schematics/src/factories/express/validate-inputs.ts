import { ExpressOptions } from '@mountnotion/types';
import { validateAuthInputs, validateBasicInputs } from '../../utils';

export function validateInputs(options: ExpressOptions): void {
  validateBasicInputs(options);
  validateAuthInputs(options);

  if (!options.drizzle) {
    throw Error('missing drizzle');
  }
}
