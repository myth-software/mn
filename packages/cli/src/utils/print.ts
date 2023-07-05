import { LogInput } from '@mountnotion/types';
import { log } from '@mountnotion/utils';
import { failActions, successActions, warnActions } from '../types';

export function printPhraseList(input: LogInput, index: number) {
  setTimeout(() => {
    if (successActions.includes(input.action)) {
      log.success(input);
    }
    if (warnActions.includes(input.action)) {
      log.warn(input);
    }
    if (failActions.includes(input.action)) {
      log.error(input);
    }
  }, index * 1000);
}
