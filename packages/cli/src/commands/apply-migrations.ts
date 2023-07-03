import {
  MountnCommand,
  MountNotionConfig,
  Schematics,
} from '@mountnotion/types';
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
    const schematics = config.schematics as Schematics[];
    const drizzleSchematic = schematics.find(
      (schematic) => schematic.name === 'drizzle'
    );
    const outDir = drizzleSchematic?.options.basic.outDir;

    if (options.command === 'check') {
      try {
        const result = execSync(
          `npx drizzle-kit check:pg --config=${outDir}/drizzle.config.ts --out=${outDir}/../drizzle`
        ).toString();
        console.log(result);
      } catch (e) {
        console.error(e);
      }
      return;
    }

    if (options.command === 'drop') {
      try {
        const result = execSync(
          `npx drizzle-kit drop:pg --config=${outDir}/drizzle.config.ts --out=${outDir}/../drizzle`
        ).toString();
        console.log(result);
      } catch (e) {
        console.error(e);
      }
      return;
    }

    if (options.command === 'generate') {
      try {
        const result = execSync(
          `npx drizzle-kit generate:pg --schema=${outDir}/schema/*.ts --out=${outDir}/../drizzle`
        ).toString();
        console.log(result);
      } catch (e) {
        console.error(e);
      }
      return;
    }

    if (options.command === 'up') {
      try {
        const result = execSync(
          `npx drizzle-kit up:pg --config=${outDir}/drizzle.config.ts --out=${outDir}/../drizzle`
        ).toString();
        console.log(result);
      } catch (e) {
        console.error(e);
      }
      return;
    }
    return;
  },
} satisfies MountnCommand;
