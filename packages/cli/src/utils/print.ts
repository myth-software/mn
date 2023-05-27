import { LogInput } from '@mountnotion/types';
import { logFail, logSuccess, logWarn } from '@mountnotion/utils';
import { failActions, successActions, warnActions } from '../types';

export function printPhraseList(input: LogInput, index: number) {
  setTimeout(() => {
    if (successActions.includes(input.action)) {
      logSuccess(input);
    }
    if (warnActions.includes(input.action)) {
      logWarn(input);
    }
    if (failActions.includes(input.action)) {
      logFail(input);
    }
  }, index * 1000);
}
