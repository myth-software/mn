import { notion } from '@mountnotion/sdk';
import {
  Entity,
  MountnCommand,
  MountNotionConfig,
  Schematics,
} from '@mountnotion/types';
import { ensure, getTitleColumnFromEntity } from '@mountnotion/utils';
import { prompt } from 'enquirer';
import { workspaceHasPages } from '../dependencies';
import { exportCSVFile, getDatabaseIdsInWorkspace } from '../utils';

type ConfigureSchematicsOptions = {
  schematics: Array<Schematics>;
  exclude: Array<string>;
};

function assert(
  condition: unknown,
  msg?: string
): asserts condition is ConfigureSchematicsOptions {
  if (typeof condition !== 'object') {
    throw new Error(msg);
  }
}

export const optionsPrompt = async (options: ConfigureSchematicsOptions) => {
  const prompts = [];
  if (!options.schematics) {
    prompts.push({
      type: 'multiselect',
      message: 'schematics to scheme',
      name: 'schematics',
      choices: [
        {
          name: 'controllers',
        },
        {
          name: 'interfaces',
        },
        {
          name: 'mirage',
        },
        {
          name: 'react-query',
        },
        {
          name: 'rtk-query',
        },
        {
          name: 'locals',
        },
      ],
    });
  }

  if (!options.exclude) {
    prompts.push({
      type: 'multiselect',
      message: 'databases to exclude from all schematics',
      name: 'exclude',
      choices: [
        {
          name: '🔵 overlays',
          value: 'xxxxssss-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        },
        {
          name: '🔢 sets',
          value: 'xxxxssss-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        },
      ],
    });
  }

  if (prompts.length) {
    const results = await prompt<ConfigureSchematicsOptions>(prompts);

    return results;
  }
  return options;
};

function dependencies(config: MountNotionConfig) {
  workspaceHasPages(config);
}

export default {
  name: 'export-data',
  description: 'export data',

  actionFactory: (config) => async () => {
    dependencies(config);
    const pageId = config.workspace.selectedPages[0];
    /**
     * collect all databases
     */
    const ids = await getDatabaseIdsInWorkspace(pageId);
    /**
     * for all databases, collect all rows
     */
    while (ids.length > 0) {
      const id = ensure(ids.shift());
      const [instances, columns] = await notion.databases.query<any>(
        {
          database_id: id,
          page_size: 100,
        },
        { all: true, resultsOnly: true, flattenResponse: true }
      );
      const mappings = Object.fromEntries(
        Object.keys(columns).map((key) => [key, key])
      );
      const TITLE = getTitleColumnFromEntity({ columns } as Entity);

      exportCSVFile(mappings, instances, TITLE);
    }

    return;
  },
} satisfies MountnCommand;
