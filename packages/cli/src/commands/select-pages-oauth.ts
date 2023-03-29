import { prompt } from 'enquirer';
import { MountnCommand } from '../types';

type SelectPagesOauthConfig = {
  pageId: string;
};

function assert(
  condition: unknown,
  msg?: string
): asserts condition is SelectPagesOauthConfig {
  if (typeof condition !== 'object') {
    throw new Error(msg);
  }
}

export const promptOAuth = async (): Promise<string[]> => {
  const results = await prompt<SelectPagesOauthConfig>([
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

  return [results.pageId];
};
// temporary workaround for value being set to boolean true (despite string type) if no argument follows the -id or --page-id flag

export default {
  name: 'select-pages-oauth',
  description:
    'select pages from a list of options that come from the results of oauth',
  options: [
    {
      name: '-id, --page-id [select-pages-oauth]',
      description: 'select pages to include',
    },
  ],
  actionFactory: () => async (options) => {
    assert(options);
    if (typeof options.pageId === 'string') {
      return;
    }

    // console.log("args:", args, "options.pageId:", options.pageId);
    if (options['pageId'] === undefined) {
      await promptOAuth();
    }
  },
} satisfies MountnCommand;
