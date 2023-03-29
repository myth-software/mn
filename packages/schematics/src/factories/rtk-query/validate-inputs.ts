import { RtkQueryOptions } from '@mountnotion/types';
import { validateAuthInputs, validateBasicInputs } from '../../utils';

export function validateInputs(options: RtkQueryOptions): void {
  validateBasicInputs(options);
  validateAuthInputs(options);

  if (!options.baseUrl) {
    throw Error('missing baseUrl');
  }
}
