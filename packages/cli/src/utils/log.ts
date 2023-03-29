import * as chalk from 'chalk';
import { LogInput } from '../types';

export const success = chalk.hex('#00ccc2');
export const error = chalk.bold.red;
export const fatal = chalk.bold.red;
export const warn = chalk.bold.hex('#FFA500');
export const info = chalk.bold();
export const debug = chalk.bold();

export const log = console.log;

export const logger = {
  info: (s: string) => s,
  debug: (s: string) => s,
  warn: (s: string) => log(chalk.bold.hex('#FFA500')(s)),
  error: (s: string) => log(chalk.bold.red(s)),
  fatal: (s: string) => log(chalk.bold.red(s)),
};

export function logSuccess({
  action,
  message,
  page: { emoji, title },
}: LogInput) {
  const paddedAction = action.padEnd(10);
  log(`${success(paddedAction)} ${emoji} ${title} ${message}`);
}

export function logWarn({ action, message, page: { emoji, title } }: LogInput) {
  const paddedAction = action.padEnd(10);
  log(`${warn(paddedAction)} ${emoji} ${title} ${message}`);
}

export function logFail({ action, message, page: { emoji, title } }: LogInput) {
  const paddedAction = action.padEnd(10);
  log(`${error(paddedAction)} ${emoji} ${title} ${message}`);
}

export function styleQuetion(input: string) {
  log(success(input));
  return;
}

export function styleReponse(input: string) {
  return success(input);
}
