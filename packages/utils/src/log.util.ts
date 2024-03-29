import { LogInput } from '@mountnotion/types';
import * as chalk from 'chalk';

export const success = chalk.bold.hex('#00ccc2');
export const error = chalk.bold.red;
export const fatal = chalk.bold.red;
export const warn = chalk.bold.hex('#FFA500');
export const info = chalk.bold;
export const debug = chalk.bold;

export const logger = {
  info: (s: string) => s,
  debug: (s: string) => console.log(debug(s)),
  warn: (s: string) => console.log(chalk.bold.hex('#FFA500')(s)),
  error: (s: string) => console.log(chalk.bold.red(s)),
  fatal: (s: string) => console.log(chalk.bold.red(s)),
};

function formatPageTitle(str: string) {
  return str.length >= 30 ? str.substring(0, 26) + '...' : str;
}

function logSuccess({ action, message, page }: LogInput) {
  const paddedAction = action.padEnd(10);
  if (page) {
    console.log(
      `(mn) ${success(paddedAction)} ${
        page.emoji.length === 2 ? page.emoji + ' ' : page.emoji
      } ${formatPageTitle(page.title)} ${message}`
    );
    return;
  }
  console.log(`(mn) ${success(paddedAction)} ${message}`);
  return;
}

function logInfo({ action, message, page }: LogInput) {
  const paddedAction = action.padEnd(10);
  if (page) {
    console.log(
      `(mn) ${info(paddedAction)} ${
        page.emoji.length === 2
          ? page.emoji + '  '
          : page.emoji.length === 3
          ? page.emoji + '   '
          : page.emoji
      } ${formatPageTitle(page.title)} ${message}`
    );
    return;
  }
  console.log(`(mn) ${info(paddedAction)} ${message}`);
  return;
}

function logWarn({ action, message, page }: LogInput) {
  const paddedAction = action.padEnd(10);
  if (page) {
    console.log(
      `(mn) ${warn(paddedAction)} ${
        page.emoji.length === 2 ? page.emoji + ' ' : page.emoji
      } ${formatPageTitle(page.title)} ${message}`
    );
    return;
  }
  console.log(`(mn) ${warn(paddedAction)} ${message}`);
  return;
}

function logError({ action, message, page }: LogInput) {
  const paddedAction = action.padEnd(10);
  if (page) {
    console.log(
      `(mn) ${error(paddedAction)} ${
        page.emoji.length === 2 ? page.emoji + ' ' : page.emoji
      } ${formatPageTitle(page.title)} ${message}`
    );
    return;
  }
  console.log(`(mn) ${error(paddedAction)} ${message}`);
  return;
}

function logFatal({ action, message, page }: LogInput) {
  const paddedAction = action.padEnd(10);
  if (page) {
    console.log(
      `(mn) ${error(paddedAction)} ${
        page.emoji.length === 2 ? page.emoji + ' ' : page.emoji
      } ${formatPageTitle(page.title)} ${message}`
    );
  }
  throw new Error(`(mn) ${error(paddedAction)} ${message}`);
}

function logDebug({ action, message, page }: LogInput) {
  const paddedAction = action.padEnd(10);
  if (page) {
    console.log(
      `(mn) ${debug(paddedAction)} ${
        page.emoji.length === 2 ? page.emoji + ' ' : page.emoji
      } ${formatPageTitle(page.title)} ${message}`
    );
    return;
  }
  console.log(`(mn) ${debug(paddedAction)} ${message}`);
  return;
}

export const log = {
  fatal: logFatal,
  error: logError,
  warn: logWarn,
  info: logInfo,
  debug: logDebug,
  success: logSuccess,
};
