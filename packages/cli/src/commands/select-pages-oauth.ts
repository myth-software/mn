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

export async function optionsPrompt() {
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
}

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
  actionFactory: () => async (args) => {
    assert(args);
    const options = await optionsPrompt();
    console.log(options);

    return;
  },
} satisfies MountnCommand;
