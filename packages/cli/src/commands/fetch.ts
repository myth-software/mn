import { createDatabaseCaches } from '@mountnotion/sdk';
import { LogInput, MountnCommand, MountNotionConfig } from '@mountnotion/types';
import { logSuccess } from '@mountnotion/utils';

function dependencies(config: MountNotionConfig) {
  const pagesSelected = config.workspace.selectedPages.length > 0;

  if (!pagesSelected) {
    throw new Error('no pages selected');
  }
}

export default {
  name: 'fetch',
  description: 'fetches databases and builds cache',

  actionFactory: (config) => async () => {
    dependencies(config);

    await createDatabaseCaches(
      config.workspace.selectedPages,
      config.options.basic
    );
    const phraseList: LogInput[] = [
      {
        action: 'listing',
        page: {
          emoji: '💪',
          title: 'flexin databases',
        },
        message: 'page children',
      },
      {
        action: 'retrieving',
        page: {
          emoji: '💪',
          title: 'flexin databases',
        },
        message: 'primary databases',
      },
      {
        action: 'retrieving',
        page: {
          emoji: '💪',
          title: 'flexin databases',
        },
        message: 'related databases',
      },
      {
        action: 'querying',
        page: {
          emoji: '💪',
          title: 'flexin databases',
        },
        message: 'primary and related databases',
      },
      {
        action: 'querying',
        page: {
          emoji: '💪',
          title: 'flexin databases',
        },
        message: 'property types',
      },
      {
        action: 'caching',
        page: {
          emoji: '💪',
          title: 'flexin databases',
        },
        message: '',
      },
    ];
    const printPhraseList = (input: LogInput, index: number) => {
      setTimeout(() => {
        logSuccess(input);
      }, index * 1000);
    };
    phraseList.forEach(printPhraseList);
  },
} satisfies MountnCommand;
