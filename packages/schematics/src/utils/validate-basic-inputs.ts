import { BasicOptions } from '@mountnotion/types';
import * as dotenv from 'dotenv';

dotenv.config();

export function validateBasicInputs(options: BasicOptions): void {
  if (!options.outDir) {
    throw Error(
      'missing outDir. please provide --out-dir /path/to/use \n an output directory should be provided. the referent directory should be in an existing loopback application.'
    );
  }
}
