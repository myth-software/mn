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
  return str.length >= 15 ? str.substring(0, 11) + '...' : str;
}

export function logSuccess({ action, message, page }: LogInput) {
  const paddedAction = action.padEnd(10);
  if (page) {
    console.log(
      `${success(paddedAction)} ${page.emoji} ${formatPageTitle(
        page.title
      )} ${message}`
    );
    return;
  }
  console.log(`${success(paddedAction)} ${message}`);
  return;
}

export function logInfo({ action, message, page }: LogInput) {
  const paddedAction = action.padEnd(10);
  if (page) {
    console.log(
      `${info(paddedAction)} ${page.emoji} ${formatPageTitle(
        page.title
      )} ${message}`
    );
    return;
  }
  console.log(`${info(paddedAction)} ${message}`);
  return;
}

export function logWarn({ action, message, page }: LogInput) {
  const paddedAction = action.padEnd(10);
  if (page) {
    console.log(
      `${warn(paddedAction)} ${page.emoji} ${formatPageTitle(
        page.title
      )} ${message}`
    );
    return;
  }
  console.log(`${warn(paddedAction)} ${message}`);
  return;
}

export function logError({ action, message, page }: LogInput) {
  const paddedAction = action.padEnd(10);
  if (page) {
    console.log(
      `${error(paddedAction)} ${page.emoji} ${formatPageTitle(
        page.title
      )} ${message}`
    );
    return;
  }
  console.log(`${error(paddedAction)} ${message}`);
  return;
}

export function logFatal({ action, message, page }: LogInput) {
  const paddedAction = action.padEnd(10);
  if (page) {
    console.log(
      `${error(paddedAction)} ${page.emoji} ${formatPageTitle(
        page.title
      )} ${message}`
    );
    return;
  }
  console.log(`${error(paddedAction)} ${message}`);
  return;
}

export function logDebug({ action, message, page }: LogInput) {
  const paddedAction = action.padEnd(10);
  if (page) {
    console.log(
      `${debug(paddedAction)} ${page.emoji} ${formatPageTitle(
        page.title
      )} ${message}`
    );
    return;
  }
  console.log(`${debug(paddedAction)} ${message}`);
  return;
}

export function styleQuestion(input: string) {
  console.log(success(input));
  return;
}

export function styleResponse(input: string) {
  return success(input);
}

export const log = {
  fatal: logFatal,
  error: logError,
  warn: logWarn,
  info: logInfo,
  debug: logDebug,
  success: logSuccess,
};
