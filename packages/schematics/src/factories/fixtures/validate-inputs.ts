import { BasicOptions } from '@mountnotion/types';
import { validateBasicInputs } from '../../utils';

export function validateInputs(options: BasicOptions): void {
  validateBasicInputs(options);

  if (!options.schema) {
    throw Error('missing schema');
  }
}
