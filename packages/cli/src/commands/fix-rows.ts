import { expandProperties, notion } from '@mountnotion/sdk';
import {
  FullGetDatabaseResponse,
  LogInput,
  MountnCommand,
} from '@mountnotion/types';
import { animals, colors, uniqueNamesGenerator } from 'unique-names-generator';
import { printPhraseList } from '../utils';

type FixRowsOptions = {
  pageId: string;
};

function assert(
  condition: unknown,
  msg?: string
): asserts condition is FixRowsOptions {
  if (typeof condition !== 'object') {
    throw new Error(msg);
  }
}

function dependencies() {
  const cache: Array<any> = [];
  const databasesWithRowsFails = cache.filter(
    (database) => database.lintFails.rows.length > 0
  );
  const canFix = databasesWithRowsFails.length > 1;

  if (!canFix) {
    throw new Error('no rows to fix');
  }
}

export default {
  name: 'fix-rows',
  description: 'standardizes any rows that failed grading',
  options: [],
  actionFactory: () => async (options) => {
    assert(options);
    dependencies();
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

    console.log('1 databases rows to lint: 📝 logs');
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
