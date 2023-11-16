import { flattenDatabaseResponse, notion } from '@mountnotion/sdk';
import { MountnCommand, MountNotionConfig } from '@mountnotion/types';
import { log } from '@mountnotion/utils';
import { prompt } from 'enquirer';
import { workspaceHasPages } from '../dependencies';
import { getDatabaseIdsInWorkspace } from '../utils';

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
    const pageId = config.workspace.selectedPages[0];
    const fromColumnName = options.from;
    const toColumnName = options.to;
    const ids = await getDatabaseIdsInWorkspace(pageId);

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

        const cache = flattenDatabaseResponse(database);
        log.success({
          action: 'renaming',
          page: {
            emoji: cache.icon,
            title: cache.title,
          },
          message: `from ${fromColumnName} to ${toColumnName}`,
        });
      }
    }
  },
} satisfies MountnCommand;
