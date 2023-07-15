import { LogInput, MountnCommand, MountNotionConfig } from '@mountnotion/types';
import { hasRowLintRules, workspaceHasPages } from '../dependencies';
import { printPhraseList } from '../utils';

type LintRowsOptions = {
  pageId: string;
};

function assert(
  condition: unknown,
  msg?: string
): asserts condition is LintRowsOptions {
  if (typeof condition !== 'object') {
    throw new Error(msg);
  }
}

function dependencies(config: MountNotionConfig) {
  workspaceHasPages(config);
  hasRowLintRules(config);
}

export default {
  name: 'lint-rows',
  description:
    "lint workspaces's databases rows for pass or fail against lint rules",
  options: [
    { name: '-p, --page-id', description: 'id of page with databases' },
  ],
  actionFactory: (config) => async (options) => {
    dependencies(config);
    assert(options);

    console.log('3 databases rows to lint: 🔢 sets, 🔵 overlays, 📝 logs');
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
