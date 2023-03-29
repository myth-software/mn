import { failActions, LogInput, successActions, warnActions } from '../types';
import { logFail, logSuccess, logWarn } from './log';

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
