import { flattenDatabaseResponse, notion } from '@mountnotion/sdk';
import {
  ColumnTypes,
  MountNotionConfig,
  MountnCommand,
} from '@mountnotion/types';
import { log } from '@mountnotion/utils';
import { prompt } from 'enquirer';
import { workspaceHasPages } from '../dependencies';
import { COLUMN_TYPES, getDatabaseIdsInWorkspace } from '../utils';

type CreateColumnsOptions = {
  name: string;
  type: ColumnTypes;
};

function assert(
  condition: unknown,
  msg?: string
): asserts condition is CreateColumnsOptions {
  if (typeof condition !== 'object') {
    throw new Error(msg);
  }
}

async function optionsPrompt(options: CreateColumnsOptions) {
  const prompts = [];
  if (!options.name) {
    prompts.push({
      type: 'input',
      message: 'column name',
      name: 'name',
    });
  }

  if (!options.type) {
    prompts.push({
      type: 'select',
      message: 'column type',
      name: 'type',
      choices: COLUMN_TYPES,
    });
  }

  if (prompts.length) {
    const results = await prompt<CreateColumnsOptions>(prompts);

    return results;
  }
  return options;
}

function dependencies(config: MountNotionConfig) {
  workspaceHasPages(config);
}

export default {
  name: 'create-columns',
  description: 'create new columns',
  options: [
    { name: '-n, --name', description: 'name of column' },
    { name: '-t, --type', description: 'type of column' },
  ],
  actionFactory: (config) => async (args) => {
    assert(args);
    dependencies(config);
    const options = await optionsPrompt(args);
    const pageId = config.selectedPages[0];
    const name = options.name;
    const type = options.type;
    const ids = await getDatabaseIdsInWorkspace(pageId);

    while (ids.length) {
      const database_id = ids.splice(0, 1)[0];
      const database = await notion.databases.retrieve({ database_id });

      if (!database.properties[name]) {
        await notion.databases.update({
          database_id,
          properties: {
            [name]: {
              [type]: {},
            },
          },
        } as any);

        const schema = flattenDatabaseResponse(database);
        log.success({
          action: 'creating',
          page: {
            emoji: schema.icon,
            title: schema.title,
          },
          message: `column ${name} of type ${type}`,
        });
      }
    }
  },
} satisfies MountnCommand;
