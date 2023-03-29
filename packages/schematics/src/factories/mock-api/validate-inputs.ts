import { MockApiOptions } from '@mountnotion/types';
import { validateAuthInputs, validateBasicInputs } from '../../utils';

export function validateInputs(options: MockApiOptions): void {
  validateBasicInputs(options);
  validateAuthInputs(options);
}
