import { flattenDatabaseResponse, notion } from '@mountnotion/sdk';
import { LogInput, MountnCommand, MountNotionConfig } from '@mountnotion/types';
import { prompt } from 'enquirer';
import { printPhraseList } from '../utils';

type RenameColumnsOptions = {
  pageId: string;
  fromColumnName: string;
  toColumnName: string;
};

function assert(
  condition: unknown,
  msg?: string
): asserts condition is RenameColumnsOptions {
  if (typeof condition !== 'object') {
    throw new Error(msg);
  }
}

async function optionsPrompt(options: RenameColumnsOptions) {
  const prompts = [];
  if (!options.pageId) {
    prompts.push({
      type: 'input',
      message: 'page id:',
      name: 'pageId',
    });
  }

  if (prompts.length) {
    const results = await prompt<RenameColumnsOptions>(prompts);

    return results;
  }
  return options;
}

function dependencies(config: MountNotionConfig) {
  const hasPages = config.workspace.selectedPages.length > 0;

  if (!hasPages) {
    throw new Error('no pages selected');
  }
}

export default {
  name: 'rename-columns',
  description: 'rename all matching columns',
  options: [
    { name: '-p, --page-id', description: 'id of page with databases' },
  ],
  actionFactory: (config) => async (args) => {
    assert(args);
    dependencies(config);
    const options = await optionsPrompt(args);
    const page_id = options.pageId;
    const fromColumnName = options.fromColumnName;
    const toColumnName = options.toColumnName;
    const allResponses = await notion.blocks.children.listAll({
      block_id: page_id,
      page_size: 100,
    });
    const ids = allResponses
      .flatMap(({ results }) => results as { type: string; id: string }[])
      .filter((result) => result.type === 'child_database')
      .map(({ id }) => id);
    const rename = [];
    while (ids.length) {
      const database_id = ids.splice(0, 1)[0];
      const database = await notion.databases.retrieve({ database_id });

      if (database.properties[fromColumnName]) {
        await notion.databases.update({
          database_id,
          properties: {
            [fromColumnName]: {
              name: toColumnName,
            },
          },
        });

        const flat = flattenDatabaseResponse(database);
        rename.push({
          title: flat.title,
          icon: flat.icon,
          from: fromColumnName,
          to: toColumnName,
        });
      }
    }

    const phraseList: LogInput[] = rename.map((n) => ({
      page: {
        emoji: n.icon,
        title: n.title,
      },
      message: `from ${n.from} to ${n.to}`,
      action: 'rename',
    }));
    phraseList.forEach(printPhraseList);
  },
} satisfies MountnCommand;
