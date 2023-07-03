import { MountnCommand, MountNotionConfig } from '@mountnotion/types';
import { logSuccess } from '@mountnotion/utils';
import { execSync } from 'child_process';

type MigrationsOptions = {
  command: 'check' | 'drop' | 'generate' | 'up';
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

export default {
  name: 'apply-migrations',
  description: 'applies migrations for production drizzle databases',
  options: [
    { name: '-c, --command <generate>', description: 'select drizzle command' },
  ],
  actionFactory: (config) => async (options) => {
    assert(options);
    dependencies(config);
    logSuccess({ action: 'starting', message: 'apply-migrations command' });

    if (options.command === 'generate') {
      const result = execSync('npx drizzle-kit generate:pg').toString();
      console.log(result);
      return;
    }
  },
} satisfies MountnCommand;
