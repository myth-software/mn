import { MountnCommand, MountNotionConfig } from '@mountnotion/types';
import { log, writeFileWithPrettyJson } from '@mountnotion/utils';
import { prompt } from 'enquirer';
import { CONFIG_FILE } from '../utils';

export async function selectPagesPrompts() {
  const results = await prompt<{
    pageId: Array<string>;
  }>([
    {
      type: 'list',
      message: 'select pages to include',
      name: 'selectPagesOauth',
      choices: [
        {
          name: '💪 flexin databases',
          value: 'xxxxssss-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        },
        {
          name: '💿 record databases',
          value: 'xxxxssss-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        },
        {
          name: '❤️ bottomless love databases',
          value: 'xxxxssss-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        },
      ],
    },
  ]);

  return results;
}

export default {
  name: 'select-pages-oauth',
  description:
    'select pages from a list of options that come from the results of oauth',
  actionFactory: (config) => async () => {
    const options = await selectPagesPrompts();
    const updatedConfig: MountNotionConfig = {
      ...config,
      workspace: {
        ...config.workspace,
        selectedPages: options.pageId,
      },
    };

    writeFileWithPrettyJson(CONFIG_FILE, updatedConfig);

    log.success({ action: 'writing', message: 'page ids to config' });
    return;
  },
} satisfies MountnCommand;
