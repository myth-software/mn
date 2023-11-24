import { MountnCommand } from '@mountnotion/types';
import { getSchema, log } from '@mountnotion/utils';
import { prompt } from 'enquirer';
import fetch from './fetch';

type CampOptions = {
  fetch: boolean;
  skipLint: boolean;
  clearSchema: boolean;
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
  if (!options.clearSchema) {
    prompts.push({
      type: 'confirm',
      message: 'remove the existing schemad workspace?',
      name: 'clearSchema',
    });
  }
  if (!options.fetch) {
    prompts.push({
      type: 'confirm',
      message: 'run the fetch command?',
      name: 'fetch',
    });
  }
  if (!options.skipLint) {
    prompts.push({
      type: 'confirm',
      message: 'skip lint rules?',
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
      name: '-c, --clear-schema',
      description: 'remove the existing schemad workspace',
    },
    { name: '-f, --fetch', description: 'run the fetch command' },
    { name: '-s, --skip-lint', description: 'skip lint rules' },
  ],
  actionFactory: (config) => async (args) => {
    assert(args);
    const oldSchema = getSchema();
    const options = await optionsPrompt(args);
    console.log(options);
    const oldString = JSON.stringify(oldSchema);
    const newSchema = await fetch.actionFactory(config)();
    const newString = JSON.stringify(newSchema);
    if (oldString !== newString) {
      log.success({
        action: 'finding',
        message: 'new schema',
      });
    }

    return;
  },
} satisfies MountnCommand;
