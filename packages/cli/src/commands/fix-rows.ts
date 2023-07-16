import { expandProperties, notion } from '@mountnotion/sdk';
import {
  Entity,
  FullGetDatabaseResponse,
  LogInput,
  MountnCommand,
} from '@mountnotion/types';
import { getTitleColumnFromEntity } from '@mountnotion/utils';
import { animals, colors, uniqueNamesGenerator } from 'unique-names-generator';
import { hasCachedLintErrors } from '../dependencies';
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
  hasCachedLintErrors();
}

export default {
  name: 'fix-rows',
  description: 'fixes any rows that have lint errors',
  options: [
    {
      name: '-p, --page-id',
      description: 'database page id',
    },
  ],
  actionFactory: () => async (options) => {
    dependencies();
    assert(options);
    const database_id = options.pageId;
    const [instances, columns] = await notion.databases.query<any>(
      {
        database_id,
        page_size: 100,
      },
      { all: true, resultsOnly: true, flattenResponse: true }
    );
    const entity = {
      columns,
    } as Entity;
    const TITLE = getTitleColumnFromEntity(entity);
    const database = (await notion.databases.retrieve({
      database_id,
    })) as FullGetDatabaseResponse;

    while (instances.length) {
      const instance = instances.shift();

      if (
        instance[TITLE] &&
        instance[TITLE] !== instance[TITLE].toLowerCase()
      ) {
        await notion.pages.update({
          page_id: instance.page_id,
          properties: expandProperties<any>(
            {
              [TITLE]: instance[TITLE].toLowerCase(),
            },
            {
              columns,
              mappings: {},
            }
          ),
        });
      }

      if (!instance[TITLE]) {
        await notion.pages.update({
          page_id: instance.page_id,
          properties: expandProperties<any>(
            {
              [TITLE]: uniqueNamesGenerator({
                dictionaries: [animals, colors],
                separator: ' ',
                length: 2,
              }),
            },
            {
              columns,
              mappings: {},
            }
          ),
        });
      }

      if (!instance.icon) {
        await notion.pages.update({
          page_id: instance.page_id,
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
