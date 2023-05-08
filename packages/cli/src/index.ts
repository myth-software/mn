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

export async function cli(): Promise<undefined> {
  const configPath = path.resolve(process.cwd(), '.mountnotion.config.json');
  process.chdir(path.dirname(configPath));
  const unparsedConfig = await fs.readFile(configPath, { encoding: 'utf8' });
  const config = JSON.parse(unparsedConfig) as MountNotionConfig;
  /**
   * third thing in "" should be surrounded by <> for a required argument to
   * that flag, or [] for optional argument to that flag. for requiring the
   * flag itself see program.requiredOption()
   */
  const program = new Command();

  program.name('mountn').description(description).version(version);

  commands.forEach((command) => {
    program.command(command.name).description(command.description);

    command.options?.forEach((option) => {
      program.argument(option.name, option.description);
    });

    program.action(command.actionFactory(config));
  });

  program.parse();
  return;
}

cli()
  .then((exitCode) => (process.exitCode = exitCode))
  .catch((e) => {
    throw e;
  });
