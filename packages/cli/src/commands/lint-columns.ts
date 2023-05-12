import { LogInput, MountnCommand } from '../types';
import { printPhraseList } from '../utils';

export default {
  name: 'lint-columns',
  description:
    'lint workspaces’s databases columns for pass or fail against standards',
  options: [],
  actionFactory: () => () => {
    console.log('3 databases columns to lint: 🔢 sets, 🔵 overlays, 📝 logs');
    const phraseList: LogInput[] = [
      {
        action: 'pass',
        page: { emoji: '🔢', title: 'sets' },
        message: 'has consistent titles as "name"',
      },
      {
        action: 'pass',
        page: { emoji: '🔢', title: 'sets' },
        message: 'has automatic created_by',
      },
      {
        action: 'pass',
        page: { emoji: '🔢', title: 'sets' },
        message: 'has automatic created_time',
      },
      {
        action: 'pass',
        page: { emoji: '🔢', title: 'sets' },
        message: 'has automatic last_edited_by',
      },
      {
        action: 'pass',
        page: { emoji: '🔢', title: 'sets' },
        message: 'has automatic last_edited_time',
      },
      {
        action: 'pass',
        page: { emoji: '🔢', title: 'sets' },
        message: 'has consistent select colors using first color',
      },
      {
        action: 'pass',
        page: { emoji: '🔢', title: 'sets' },
        message: 'has consistent multi_select colors using first color',
      },
      {
        action: 'pass',
        page: { emoji: '🔢', title: 'sets' },
        message: 'has lowercase column names',
      },
      {
        action: 'pass',
        page: { emoji: '🔢', title: 'sets' },
        message: 'has relations with leading emoji',
      },
      {
        action: 'pass',
        page: { emoji: '🔵', title: 'overlays' },
        message: 'has consistent titles as "name"',
      },
      {
        action: 'pass',
        page: { emoji: '🔵', title: 'overlays' },
        message: 'has automatic created_by',
      },
      {
        action: 'fail',
        page: { emoji: '🔵', title: 'overlays' },
        message: 'has automatic created_time',
      },
      {
        action: 'pass',
        page: { emoji: '🔵', title: 'overlays' },
        message: 'has automatic last_edited_by',
      },
      {
        action: 'pass',
        page: { emoji: '🔵', title: 'overlays' },
        message: 'has automatic last_edited_time',
      },
      {
        action: 'pass',
        page: { emoji: '🔵', title: 'overlays' },
        message: 'has consistent select colors using first color',
      },
      {
        action: 'pass',
        page: { emoji: '🔵', title: 'overlays' },
        message: 'has consistent multi_select colors using first color',
      },
      {
        action: 'pass',
        page: { emoji: '🔵', title: 'overlays' },
        message: 'has lowercase column names',
      },
      {
        action: 'pass',
        page: { emoji: '🔵', title: 'overlays' },
        message: 'has relations with leading emoji',
      },
      {
        action: 'fail',
        page: { emoji: '📝', title: 'logs' },
        message: 'title "Title" has consistent titles as "name"',
      },
      {
        action: 'fail',
        page: { emoji: '📝', title: 'logs' },
        message: 'has automatic created_by',
      },
      {
        action: 'fail',
        page: { emoji: '📝', title: 'logs' },
        message: 'has automatic created_time',
      },
      {
        action: 'fail',
        page: { emoji: '📝', title: 'logs' },
        message: 'has automatic last_edited_by',
      },
      {
        action: 'fail',
        page: { emoji: '📝', title: 'logs' },
        message: 'has automatic last_edited_time',
      },
      {
        action: 'fail',
        page: { emoji: '📝', title: 'logs' },
        message:
          'select "method" has consistent select colors using first color',
      },
      {
        action: 'fail',
        page: { emoji: '📝', title: 'logs' },
        message:
          'multi_select "Tags" has consistent multi_select colors using first color',
      },
      {
        action: 'fail',
        page: { emoji: '📝', title: 'logs' },
        message: 'multi_select "Tags" has lowercase column names',
      },
      {
        action: 'fail',
        page: { emoji: '📝', title: 'logs' },
        message: 'relation "user" has relations with leading emoji',
      },
    ];
    phraseList.forEach(printPhraseList);
  },
} satisfies MountnCommand;
