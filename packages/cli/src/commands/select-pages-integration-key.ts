import { MountnCommand, MountNotionConfig } from '@mountnotion/types';
import { ensure, log, writeFileWithPrettyJson } from '@mountnotion/utils';
import { prompt } from 'enquirer';
import { CONFIG_FILE } from '../utils';
import parseUuidFromUrl from '../utils/parse-uuid-from-url';

type SelectPagesIntegrationKeyOptions = {
  pageId: string[];
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
      message:
        "type page_id of selected page to include [press 'c' when complete]",
      name: 'pageId',
    });
  }

  if (prompts.length) {
    const results: SelectPagesIntegrationKeyOptions = { pageId: [] };
    let result;

    while (result !== 'c') {
      const { pageId } = await prompt<{ pageId: string }>(prompts);

      if (pageId === 'c') {
        result = pageId;
        break;
      }

      results.pageId.push(pageId);
    }

    return results;
  }
  return options;
};

export default {
  name: 'select-pages-integration-key',
  description:
    'select pages manually, where there is no known list of available options',
  options: [
    {
      name: '-p, --page-id <id>',
      description: 'id of page or notion url of page  with databases',
    },
  ],
  actionFactory: (config) => async (args) => {
    assert(args);
    const options = await optionsPrompt(args);

    const selectedPages = options.pageId.map((id) =>
      parseUuidFromUrl(id) ? ensure(parseUuidFromUrl(id)) : id
    );

    const updatedConfig: MountNotionConfig = {
      ...config,
      selectedPages,
    };

    writeFileWithPrettyJson(CONFIG_FILE, updatedConfig);

    log.success({ action: 'writing', message: 'page ids to config' });
    return;
  },
} satisfies MountnCommand;
