import { MountnCommand } from '@mountnotion/types';
import { prompt } from 'enquirer';

type SelectPagesOauthOptions = {
  pageId: string;
};

function assert(
  condition: unknown,
  msg?: string
): asserts condition is SelectPagesOauthOptions {
  if (typeof condition !== 'object') {
    throw new Error(msg);
  }
}

export const optionsPrompt = async () => {
  const results = await prompt<SelectPagesOauthOptions>([
    {
      type: 'list',
      message: 'Select pages to include:',
      name: 'selectPagesOauth',
      choices: [
        '💪 flexin databases',
        '💿 record databases',
        '❤️ bottomless love databases',
      ],
    },
  ]);

  return results;
};
// temporary workaround for value being set to boolean true (despite string type) if no argument follows the -id or --page-id flag

export default {
  name: 'select-pages-oauth',
  description:
    'select pages from a list of options that come from the results of oauth',
  options: [
    {
      name: '-p, --page-id [select-pages-oauth]',
      description: 'select pages to include',
    },
  ],
  actionFactory: () => async (options) => {
    assert(options);

    if (!options.pageId) {
      await optionsPrompt();
      return;
    }

    return;
  },
} satisfies MountnCommand;
