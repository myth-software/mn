import { LogInput, MountnCommand } from '@mountnotion/types';
import { printPhraseList } from '../utils';

export default {
  name: 'fix-columns',
  description: 'standardizes any columns that failed grading',
  options: [],
  actionFactory: () => async () => {
    console.log('2 databases columns to standardize: 🔢 sets, 📝 logs');
    const phraseList: LogInput[] = [
      {
        action: 'create',
        page: { emoji: '🔵', title: 'overlays' },
        message: 'created_time as "created time"',
      },
      {
        action: 'update',
        page: { emoji: '📝', title: 'logs' },
        message: 'title "Title" to "name"',
      },
      {
        action: 'create',
        page: { emoji: '📝', title: 'logs' },
        message: 'created_by as "created by"',
      },
      {
        action: 'create',
        page: { emoji: '📝', title: 'logs' },
        message: 'created_time as "created time"',
      },
      {
        action: 'create',
        page: { emoji: '📝', title: 'logs' },
        message: 'created_last_edited_by as "last edited by"',
      },
      {
        action: 'create',
        page: { emoji: '📝', title: 'logs' },
        message: 'last_edited_time as "last edited time"',
      },
      {
        action: 'update',
        page: { emoji: '📝', title: 'logs' },
        message: 'select "method" colors to brown',
      },
      {
        action: 'update',
        page: { emoji: '📝', title: 'logs' },
        message: 'multi_select "Tags" colors to green',
      },
      {
        action: 'update',
        page: { emoji: '📝', title: 'logs' },
        message: 'multi_select "Tags" to "tags"',
      },
      {
        action: 'warn',
        page: { emoji: '📝', title: 'logs' },
        message:
          'relation "user" cannot automatically be updated to "🙂 user". manual update in notion is required.',
      },
    ];
    phraseList.forEach(printPhraseList);
  },
} satisfies MountnCommand;
