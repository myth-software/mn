import { LogInput } from '@mountnotion/types';
import * as chalk from 'chalk';

export const success = chalk.bold.hex('#00ccc2');
export const error = chalk.bold.red;
export const fatal = chalk.bold.red;
export const warn = chalk.bold.hex('#FFA500');
export const info = chalk.bold;
export const debug = chalk.bold();

export const log = console.log;

export const logger = {
  info: (s: string) => s,
  debug: (s: string) => s,
  warn: (s: string) => log(chalk.bold.hex('#FFA500')(s)),
  error: (s: string) => log(chalk.bold.red(s)),
  fatal: (s: string) => log(chalk.bold.red(s)),
};

function formatPageTitle(str: string) {
  return str.length >= 15 ? str.substring(0, 11) + '...' : str;
}

export function logSuccess({ action, message, page }: LogInput) {
  const paddedAction = action.padEnd(10);
  if (page) {
    log(
      `${success(paddedAction)} ${page.emoji} ${formatPageTitle(
        page.title
      )} ${message}`
    );
    return;
  }
  log(`${success(paddedAction)} ${message}`);
  return;
}

export function logInfo({ action, message, page }: LogInput) {
  const paddedAction = action.padEnd(10);
  if (page) {
    log(
      `${info(paddedAction)} ${page.emoji} ${formatPageTitle(
        page.title
      )} ${message}`
    );
    return;
  }
  log(`${info(paddedAction)} ${message}`);
  return;
}

export function logWarn({ action, message, page }: LogInput) {
  const paddedAction = action.padEnd(10);
  if (page) {
    log(
      `${warn(paddedAction)} ${page.emoji} ${formatPageTitle(
        page.title
      )} ${message}`
    );
    return;
  }
  log(`${warn(paddedAction)} ${message}`);
  return;
}

export function logFail({ action, message, page }: LogInput) {
  const paddedAction = action.padEnd(10);
  if (page) {
    log(
      `${error(paddedAction)} ${page.emoji} ${formatPageTitle(
        page.title
      )} ${message}`
    );
    return;
  }
  log(`${error(paddedAction)} ${message}`);
  return;
}

export function styleQuestion(input: string) {
  log(success(input));
  return;
}

export function styleResponse(input: string) {
  return success(input);
}
