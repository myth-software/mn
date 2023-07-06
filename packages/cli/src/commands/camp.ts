import { MountnCommand } from '@mountnotion/types';
import { prompt } from 'enquirer';

type CampOptions = {
  fetch: boolean;
  skipLint: boolean;
  clearCache: boolean;
};

function assert(
  condition: unknown,
  msg?: string
): asserts condition is CampOptions {
  if (typeof condition !== 'object') {
    throw new Error(msg);
  }
}

export const optionsPrompt = async (options: CampOptions) => {
  const prompts = [];
  if (!options.clearCache) {
    prompts.push({
      type: 'input',
      message: 'remove the existing cached workspace',
      name: 'clearCache',
    });
  }
  if (!options.fetch) {
    prompts.push({
      type: 'input',
      message: 'run the fetch command',
      name: 'fetch',
    });
  }
  if (!options.skipLint) {
    prompts.push({
      type: 'input',
      message: 'skip lint rules',
      name: 'skipLint',
    });
  }

  if (prompts.length) {
    const results = await prompt<CampOptions>(prompts);

    return results;
  }
  return options;
};

export default {
  name: 'camp',
  description: 'runs a watch command then calls an api on press of keyboard',
  options: [
    {
      name: '-c, --clear-cache',
      description: 'remove the existing cached workspace',
    },
    { name: '-f, --fetch', description: 'run the fetch command' },
    { name: '-s, --skip-lint', description: 'skip lint rules' },
  ],
  actionFactory: () => async (args) => {
    assert(args);
    const options = await optionsPrompt(args);
    console.log(options);
    return;
  },
} satisfies MountnCommand;
