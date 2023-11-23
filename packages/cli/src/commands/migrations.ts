import { MountnCommand, MountNotionConfig } from '@mountnotion/types';
import { log } from '@mountnotion/utils';
import { prompt } from 'enquirer';
import runInteractiveCommand from '../utils/run-interactive-command.util';

type MigrationsOptions = {
  command: 'check' | 'drop' | 'generate' | 'up' | 'migrate';
};

function assert(
  condition: unknown,
  msg?: string
): asserts condition is MigrationsOptions {
  if (typeof condition !== 'object') {
    throw new Error(msg);
  }
}

function dependencies(config: MountNotionConfig) {
  const drizzleExists = config.schematics.some(
    (schematic) => schematic.name === 'drizzle'
  );

  if (!drizzleExists) {
    throw new Error('drizzle is not configured');
  }
}

async function optionsPrompt(options: MigrationsOptions) {
  const prompts = [];
  if (!options.command) {
    prompts.push({
      name: 'command',
      type: 'select',
      message: 'select command',
      choices: [
        { name: 'check', hint: 'check up on the migrations' },
        { name: 'drop', hint: 'safely delete migration files' },
        { name: 'generate', hint: 'create new migration file' },
        { name: 'up', hint: 'shape up metadata' },
        { name: 'migrate', hint: 'run migration from file' },
      ],
    });
  }

  if (prompts.length) {
    const results = await prompt<MigrationsOptions>(prompts);
    return results;
  }

  return options;
}

export default {
  name: 'migrations',
  description: 'applies migrations for production drizzle databases',
  options: [{ name: '-c, --command <name>', description: 'select command' }],
  actionFactory: (config) => async (args) => {
    assert(args);
    dependencies(config);

    const drizzleSchematic = config.schematics.find(
      (schematic) => schematic.name === 'drizzle'
    );
    const outDir = drizzleSchematic?.outDir;

    const command = (await optionsPrompt(args)).command;

    if (command === 'check') {
      try {
        await runInteractiveCommand(`npx`, [
          'drizzle-kit',
          'check:pg',
          `--config=${outDir}/drizzle.config.ts`,
        ]);

        log.success({
          action: 'checking',
          message: 'successful',
        });
      } catch (e) {
        console.error(e);
      }
      return;
    }

    if (command === 'drop') {
      try {
        await runInteractiveCommand(`npx`, [
          'drizzle-kit',
          'drop',
          `--config=${outDir}/drizzle.config.ts`,
        ]);
        log.success({
          action: 'dropping',
          message: 'successful',
        });
      } catch (e) {
        console.error(e);
      }
      return;
    }

    if (command === 'generate') {
      try {
        await runInteractiveCommand(`npx`, [
          'drizzle-kit',
          'generate:pg',
          `--config=${outDir}/drizzle.config.ts`,
        ]);

        log.success({
          action: 'generating',
          message: 'successful',
        });
      } catch (e) {
        console.error(e);
      }
    }

    if (command === 'migrate') {
      await runInteractiveCommand('npx', [
        'ts-node',
        `${outDir}/migrate.ts`,
        `${outDir}`,
      ]);

      log.success({
        action: 'migrating',
        message: 'successful',
      });

      return;
    }

    if (command === 'up') {
      try {
        await runInteractiveCommand('npx', [
          'drizzle-kit',
          'up:pg',
          `--config=${outDir}/drizzle.config.ts`,
        ]);

        log.success({
          action: 'upping',
          message: 'successful',
        });
      } catch (e) {
        console.error(e);
      }
      return;
    }
  },
} satisfies MountnCommand;
