import { flattenDatabaseResponse, notion } from '@mountnotion/sdk';
import { MountnCommand, MountNotionConfig } from '@mountnotion/types';
import { log } from '@mountnotion/utils';
import { prompt } from 'enquirer';
import { workspaceHasPages } from '../dependencies';

type RenameColumnsOptions = {
  from: string;
  to: string;
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
  if (!options.from) {
    prompts.push({
      type: 'input',
      message: 'from column',
      name: 'from',
    });
  }

  if (!options.to) {
    prompts.push({
      type: 'input',
      message: 'to column',
      name: 'to',
    });
  }

  if (prompts.length) {
    const results = await prompt<RenameColumnsOptions>(prompts);

    return results;
  }
  return options;
}

function dependencies(config: MountNotionConfig) {
  workspaceHasPages(config);
}

export default {
  name: 'rename-columns',
  description: 'rename all matching columns',
  options: [
    { name: '-f, --from', description: 'original name to rename from' },
    { name: '-t, --to', description: 'new name to rename to' },
  ],
  actionFactory: (config) => async (args) => {
    assert(args);
    dependencies(config);
    const options = await optionsPrompt(args);
    const page_id = config.workspace.selectedPages[0];
    const fromColumnName = options.from;
    const toColumnName = options.to;
    const allResponses = await notion.blocks.children.listAll({
      block_id: page_id,
      page_size: 100,
    });
    const ids = allResponses
      .flatMap(({ results }) => results as { type: string; id: string }[])
      .filter((result) => result.type === 'child_database')
      .map(({ id }) => id);

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
        log.success({
          action: 'renaming',
          page: {
            emoji: flat.icon,
            title: flat.title,
          },
          message: `from ${fromColumnName} to ${toColumnName}`,
        });
      }
    }
  },
} satisfies MountnCommand;
