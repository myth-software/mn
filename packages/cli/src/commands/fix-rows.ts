import {
  expandProperties,
  flattenDatabaseResponse,
  notion,
} from '@mountnotion/sdk';
import { MountnCommand, Schema } from '@mountnotion/types';
import { getTitleColumnFromSchema, log } from '@mountnotion/utils';
import { prompt } from 'enquirer';
import { animals, colors, uniqueNamesGenerator } from 'unique-names-generator';

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

async function optionsPrompt(options: FixRowsOptions) {
  const prompts = [];
  if (!options.pageId) {
    prompts.push({
      type: 'input',
      message: 'database page id',
      name: 'pageId',
    });
  }

  if (prompts.length) {
    const results = await prompt<FixRowsOptions>(prompts);

    return results;
  }
  return options;
}

function dependencies() {
  return;
}

export default {
  name: 'fix-rows',
  description: 'fixes any rows that have lint errors',
  options: [
    {
      name: '-p, --page-id <pageId>',
      description: 'database page id',
    },
  ],
  actionFactory: () => async (args) => {
    dependencies();
    assert(args);
    const options = await optionsPrompt(args);
    const database_id = options.pageId;
    const [instances, columns] = await notion.databases.query<any>(
      {
        database_id,
        page_size: 100,
      },
      { all: true, resultsOnly: true, flattenResponse: true }
    );
    const partialSchema = {
      columns,
    } as Schema;
    const TITLE = getTitleColumnFromSchema(partialSchema);
    const database = await notion.databases.retrieve({
      database_id,
    });
    const schema = flattenDatabaseResponse(database);

    while (instances.length) {
      const instance = instances.shift();
      const mappings = Object.fromEntries(
        Object.keys(columns).map((key) => [key, key])
      );

      if (
        instance[TITLE] &&
        instance[TITLE] !== instance[TITLE].toLowerCase()
      ) {
        await notion.pages.update({
          page_id: instance.id,
          properties: expandProperties<any>(
            {
              [TITLE]: instance[TITLE].toLowerCase(),
            },
            {
              columns,
              mappings,
            }
          ),
        });

        log.success({
          action: 'fixing',
          page: {
            emoji: schema.icon,
            title: schema.title,
          },
          message: `id '${instance.id}' title property '${TITLE}' from '${
            instance[TITLE]
          }' to ${instance[TITLE].toLowerCase()}`,
        });
      }

      if (!instance[TITLE] || instance[TITLE] === 'untitled') {
        const title = uniqueNamesGenerator({
          dictionaries: [animals, colors],
          separator: ' ',
          length: 2,
        });
        await notion.pages.update({
          page_id: instance.id,
          properties: expandProperties<any>(
            {
              [TITLE]: title,
            },
            {
              columns,
              mappings,
            }
          ),
        });

        log.success({
          action: 'fixing',
          page: {
            emoji: schema.icon,
            title: schema.title,
          },
          message: `id '${instance.id}' title property '${TITLE}' to ${title}`,
        });
      }

      if (!instance.icon) {
        await notion.pages.update({
          page_id: instance.id,
          icon:
            database.icon?.type === 'emoji' && database.icon.emoji
              ? {
                  type: 'emoji',
                  emoji: database.icon.emoji,
                }
              : null,
        });

        log.success({
          action: 'fixing',
          page: {
            emoji: schema.icon,
            title: schema.title,
          },
          message: `id '${instance.id}' icon to ${schema.icon}`,
        });
      }
    }
  },
} satisfies MountnCommand;
