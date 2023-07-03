import { LogInput, MountnCommand } from '@mountnotion/types';
import { printPhraseList } from '../utils';

export default {
  name: 'fix-rows',
  description: 'standardizes any rows that failed grading',
  options: [],
  actionFactory: () => async () => {
    console.log('1 databases rows to standardize: 📝 logs');
    const phraseList: LogInput[] = [
      {
        action: `update`,
        page: { emoji: '📝', title: 'logs' },
        message: `page_id 'bd7beed3-ba4a-499b-8f9d-16a4dd73e24f' title "Ticked" to "ticked"`,
      },
      {
        action: `update`,
        page: { emoji: '📝', title: 'logs' },
        message: `page_id '5bf11310-23ae-429b-8f0a-d3d33fbc8b23' title "Untitled" to "zebra white"`,
      },
      {
        action: `update`,
        page: { emoji: '📝', title: 'logs' },
        message: `page_id '41f0d2d4-9ddb-44f9-aeac-bf68c17704e0' title "Untitled" to "giraffe orange"`,
      },
      {
        action: `update`,
        page: { emoji: '📝', title: 'logs' },
        message: `page_id '41f0d2d4-9ddb-44f9-aeac-bf68c17704e0' icon to 📝`,
      },
    ];
    phraseList.forEach(printPhraseList);
  },
} satisfies MountnCommand;
