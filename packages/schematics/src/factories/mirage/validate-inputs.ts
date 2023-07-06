import { MirageOptions } from '@mountnotion/types';
import { validateAuthInputs, validateBasicInputs } from '../../utils';

export function validateInputs(options: MirageOptions): void {
  validateBasicInputs(options);
  validateAuthInputs(options);
}
