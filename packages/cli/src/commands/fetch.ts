import { createDatabaseCaches } from '@mountnotion/sdk';
import { LogInput, MountnCommand, MountNotionConfig } from '@mountnotion/types';
import { logSuccess } from '@mountnotion/utils';

export type FetchOptions = {
  pageId: string;
};

function assert(
  condition: unknown,
  msg?: string
): asserts condition is FetchOptions {
  if (typeof condition !== 'object') {
    throw new Error(msg);
  }
}

function dependencies(config: MountNotionConfig) {
  const pagesSelected = config.workspace.selectedPages.length > 0;

  if (!pagesSelected) {
    throw new Error('no pages selected');
  }
}

export default {
  name: 'fetch',
  description: 'fetches databases and builds cache',
  options: [
    { name: '-p, --page-id <id>', description: 'id of page with databases' },
  ],
  actionFactory: (config) => async (options) => {
    assert(options);
    dependencies(config);

    const pageIds = [options.pageId];
    await createDatabaseCaches(pageIds, config.options.basic);
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
