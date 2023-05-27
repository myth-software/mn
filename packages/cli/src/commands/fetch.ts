import { LogInput, MountnCommand } from '@mountnotion/types';
import { logSuccess } from '@mountnotion/utils';

export default {
  name: 'fetch',
  description: 'fetches databases and builds cache',
  actionFactory: () => async () => {
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
