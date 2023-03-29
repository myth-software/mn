import { LogInput, MountnCommand } from '../types';
import { printPhraseList } from '../utils';

export default {
  name: 'grade-standards-rows',
  description:
    'grade workspaces’s databases rows for pass or fail against standards',
  options: [
    { name: '-p, --page-id', description: 'id of page with databases' },
  ],
  actionFactory: () => () => {
    console.log('3 databases rows to grade: 🔢 sets, 🔵 overlays, 📝 logs');
    const phraseList: LogInput[] = [
      {
        action: 'pass',
        page: { emoji: '🔢', title: 'sets' },
        message: 'has lowercase page titles',
      },
      {
        action: 'pass',
        page: { emoji: '🔢', title: 'sets' },
        message: 'has untitled pages default to animal color names',
      },
      {
        action: 'pass',
        page: { emoji: '🔢', title: 'sets' },
        message: 'has pages without icons default to database icon',
      },
      {
        action: 'pass',
        page: { emoji: '🔵', title: 'overlays' },
        message: 'has lowercase page titles',
      },
      {
        action: 'pass',
        page: { emoji: '🔵', title: 'overlays' },
        message: 'has untitled pages default to animal color names',
      },
      {
        action: 'pass',
        page: { emoji: '🔵', title: 'overlays' },
        message: 'has pages without icons default to database icon',
      },
      {
        action: 'fail',
        page: { emoji: '📝', title: 'logs' },
        message:
          'page_id "bd7beed3-ba4a-499b-8f9d-16a4dd73e24f" has lowercase page titles',
      },
      {
        action: 'fail',
        page: { emoji: '📝', title: 'logs' },
        message:
          'page_id "bd7beed3-ba4a-499b-8f9d-16a4dd73e24f" has untitled pages default to animal color names',
      },
      {
        action: 'fail',
        page: { emoji: '📝', title: 'logs' },
        message:
          'page_id "bd7beed3-ba4a-499b-8f9d-16a4dd73e24f" has pages without icons default to database icon',
      },
    ];

    phraseList.forEach(printPhraseList);
  },
} satisfies MountnCommand;
