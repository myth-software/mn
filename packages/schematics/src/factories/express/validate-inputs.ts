import { ControllersOptions } from '@mountnotion/types';
import { validateAuthInputs, validateBasicInputs } from '../../utils';

export function validateInputs(options: ControllersOptions): void {
  validateBasicInputs(options);
  validateAuthInputs(options);

  if (!options.entities) {
    throw Error('missing entities');
  }
}
