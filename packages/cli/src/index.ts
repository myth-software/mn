#!/usr/bin/env node

/**
 * imports
 */
import { MountNotionConfig } from '@mountnotion/types';
import { Command } from 'commander';
import * as fs from 'fs/promises';
import * as path from 'path';
import { description, version } from '../package.json';
import { commands } from './commands';
import { CONFIG_FILE } from './utils';

export async function cli(): Promise<0> {
  process.chdir(path.dirname(CONFIG_FILE));
  const unparsedConfig = await fs.readFile(CONFIG_FILE, { encoding: 'utf8' });
  const config = JSON.parse(unparsedConfig) as MountNotionConfig;
  /**
   * third thing in "" should be surrounded by <> for a required argument to
   * that flag, or [] for optional argument to that flag. for requiring the
   * flag itself see program.requiredOption()
   */
  const program = new Command();

  program.name('mn').description(description).version(version);

  commands.forEach((command) => {
    const subcommand = program
      .command(command.name)
      .description(command.description)
      .action(command.actionFactory(config));

    command.options?.forEach((option) => {
      subcommand.option(option.name, option.description);
    });
  });

  program.parse();
  return 0;
}

cli()
  .then((exitCode) => (process.exitCode = exitCode))
  .catch((e) => {
    throw e;
  });
