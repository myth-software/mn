import { BasicOptions } from '@mountnotion/types';
import * as dotenv from 'dotenv';

dotenv.config();

export function validateBasicInputs(options: BasicOptions): void {
  if (!options.pageId) {
    throw Error(
      'missing pageId. please provide --page-id xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx \n a page id should be provided. the referent page should include the databases to be found as direct children.',
    );
  }
  if (!options.outDir) {
    throw Error(
      'missing outDir. please provide --out-dir /path/to/use \n an output directory should be provided. the referent directory should be in an existing loopback application.',
    );
  }
}
