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

export const promptSelectPagesIntegrationKey = async (): Promise<string> => {
  const results = await prompt<SelectPagesIntegrationKeyOptions>([
    {
      type: 'input',
      name: 'pageId',
      message: 'page id:',
    },
  ]);

  return results.pageId;
};

export default {
  name: 'select-pages-integration-key',
  description:
    'select pages manually, where there is no known list of available options',
  options: [
    { name: '-p, --page-id', description: 'id of page with databases' },
  ],
  actionFactory: () => async (options) => {
    assert(options);

    if (!options.pageId) {
      await promptSelectPagesIntegrationKey();
      return;
    }

    return;
  },
} satisfies MountnCommand;
