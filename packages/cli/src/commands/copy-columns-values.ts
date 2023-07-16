import {
  expandProperties,
  flattenDatabaseResponse,
  notion,
} from '@mountnotion/sdk';
import {
  FullGetDatabaseResponse,
  MountnCommand,
  MountNotionConfig,
} from '@mountnotion/types';
import { log } from '@mountnotion/utils';
import { prompt } from 'enquirer';
import { workspaceHasPages } from '../dependencies';

type CopyColumnsValuesOptions = {
  from: string;
  to: string;
  pageId: string;
};

async function optionsPrompt(options: CopyColumnsValuesOptions) {
  const prompts = [];
  if (!options.pageId) {
    prompts.push({
      type: 'input',
      message: 'database page id',
      name: 'pageId',
    });
  }

  if (!options.from) {
    prompts.push({
      type: 'input',
      message: 'column to copy from',
      name: 'from',
    });
  }

  if (!options.to) {
    prompts.push({
      type: 'input',
      message: 'column to copy to',
      name: 'to',
    });
  }

  if (prompts.length) {
    const results = await prompt<CopyColumnsValuesOptions>(prompts);

    return results;
  }
  return options;
}

function assert(
  condition: unknown,
  msg?: string
): asserts condition is CopyColumnsValuesOptions {
  if (typeof condition !== 'object') {
    throw new Error(msg);
  }
}

function dependencies(config: MountNotionConfig) {
  workspaceHasPages(config);
}

export default {
  name: 'copy-columns-values',
  description: 'copy values from one column to another',
  options: [
    { name: '-p, --page-id <pageId>', description: 'database page id' },
    { name: '-f, --from <from>', description: 'column to copy from' },
    { name: '-t, --to <to>', description: 'column to copy to' },
  ],
  actionFactory: (config) => async (args) => {
    dependencies(config);
    assert(args);
    const options = await optionsPrompt(args);
    const database_id = options.pageId;
    const from = options.from;
    const to = options.to;
    const [instances, columns] = await notion.databases.query<any>(
      {
        database_id,
        page_size: 100,
      },
      { all: true, resultsOnly: true, flattenResponse: true }
    );

    const database = (await notion.databases.retrieve({
      database_id,
    })) as FullGetDatabaseResponse;

    while (instances.length) {
      const instance = instances.shift();

      await notion.pages.update({
        page_id: instance.id,
        properties: expandProperties<any>(
          {
            [from]: null,
            [to]: instance[from],
          },
          {
            columns,
            mappings: Object.fromEntries(
              Object.keys(columns).map((key) => [key, key])
            ),
          }
        ),
      });
      const flat = flattenDatabaseResponse(database);
      log.success({
        action: 'copying',
        page: {
          emoji: flat.icon,
          title: flat.title,
        },
        message: `value ${instance[from]} from ${from} to ${to}`,
      });
    }
  },
} satisfies MountnCommand;
