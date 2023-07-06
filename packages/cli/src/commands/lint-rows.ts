import { expandProperties, notion } from '@mountnotion/sdk';
import {
  FullGetDatabaseResponse,
  LogInput,
  MountnCommand,
  MountNotionConfig,
} from '@mountnotion/types';
import { animals, colors, uniqueNamesGenerator } from 'unique-names-generator';
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
  const hasRules =
    config.workspace?.lint?.rows &&
    Object.keys(config.workspace.lint.rows).length > 0;

  if (!hasRules) {
    throw new Error('no rules configured');
  }
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
    const database_id = options.pageId;
    const [entities, properties] = await notion.databases.query<any>(
      {
        database_id,
        page_size: 100,
      },
      { all: true, resultsOnly: true, flattenResponse: true }
    );

    const database = (await notion.databases.retrieve({
      database_id,
    })) as FullGetDatabaseResponse;

    while (entities.length) {
      const entity = entities.shift();

      if (entity.name && entity.name !== entity.name.toLowerCase()) {
        await notion.pages.update({
          page_id: entity.page_id,
          properties: expandProperties<any>(
            {
              name: entity.name.toLowerCase(),
            },
            {
              columns: properties,
              mappings: {},
            }
          ),
        });
      }

      if (!entity.name) {
        await notion.pages.update({
          page_id: entity.page_id,
          properties: expandProperties<any>(
            {
              name: uniqueNamesGenerator({
                dictionaries: [animals, colors],
                separator: ' ',
                length: 2,
              }),
            },
            {
              columns: properties,
              mappings: {},
            }
          ),
        });
      }

      if (!entity.icon) {
        await notion.pages.update({
          page_id: entity.page_id,
          icon: database.icon,
        });
      }
    }

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
