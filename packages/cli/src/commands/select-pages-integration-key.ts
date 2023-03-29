import { prompt } from 'enquirer';
import { MountnCommand } from '../types';

type SelectPagesIntegrationKeyConfig = {
  pageId: string;
};

function assert(
  condition: unknown,
  msg?: string
): asserts condition is SelectPagesIntegrationKeyConfig {
  if (typeof condition !== 'object') {
    throw new Error(msg);
  }
}

export const promptSelectPagesIntegrationKey = async (): Promise<string> => {
  const results = await prompt<SelectPagesIntegrationKeyConfig>([
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
  actionFactory: () => async (options, next, again) => {
    assert(options);

    console.log({ options, next: (next as any).args, again });

    const integrationKey =
      typeof options.pageId === 'string'
        ? options.pageId
        : await promptSelectPagesIntegrationKey();

    console.log(integrationKey);
  },
} satisfies MountnCommand;
