import { MountnCommand, MountNotionConfig } from '@mountnotion/types';
import { execSync } from 'child_process';
import { prompt } from 'enquirer';

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

async function optionsPrompt() {
  const results = await prompt<MigrationsOptions>([
    {
      name: 'command',
      type: 'select',
      message: 'select command:',
      choices: [
        { name: 'check' },
        { name: 'drop' },
        { name: 'generate' },
        { name: 'up' },
        { name: 'migrate' },
      ],
    },
  ]);
  return results;
}

export default {
  name: 'apply-migrations',
  description: 'applies migrations for production drizzle databases',
  options: [
    { name: '-c, --command <generate>', description: 'select command' },
  ],
  actionFactory: (config) => async (options) => {
    assert(options);
    dependencies(config);

    const drizzleSchematic = config.schematics.find(
      (schematic) => schematic.name === 'drizzle'
    );
    const outDir = drizzleSchematic?.options.basic.outDir;
    const command = options.command ?? (await optionsPrompt()).command;

    if (command === 'check') {
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

    if (command === 'drop') {
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

    if (command === 'generate') {
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

    if (command === 'migrate') {
      const result = execSync(
        `npx ts-node ${outDir}/migrate.ts ${outDir}`
      ).toString();
      console.log(result);
      return;
    }

    if (command === 'up') {
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
