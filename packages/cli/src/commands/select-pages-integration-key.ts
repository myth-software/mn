import { MountnCommand } from '@mountnotion/types';
import { prompt } from 'enquirer';

type SelectPagesIntegrationKeyOptions = {
  pageId: string;
};

function assert(
  condition: unknown,
  msg?: string
): asserts condition is SelectPagesIntegrationKeyOptions {
  if (typeof condition !== 'object') {
    throw new Error(msg);
  }
}

export const optionsPrompt = async (
  options: SelectPagesIntegrationKeyOptions
) => {
  const prompts = [];
  if (!options.pageId) {
    prompts.push({
      type: 'input',
      message: 'page id:',
      name: 'pageId',
    });
  }

  if (prompts.length) {
    const results = await prompt<SelectPagesIntegrationKeyOptions>(prompts);

    return results;
  }
  return options;
};

export default {
  name: 'select-pages-integration-key',
  description:
    'select pages manually, where there is no known list of available options',
  options: [
    { name: '-p, --page-id <id>', description: 'id of page with databases' },
  ],
  actionFactory: () => async (args) => {
    assert(args);
    const options = await optionsPrompt(args);
    console.log(options);

    return;
  },
} satisfies MountnCommand;
