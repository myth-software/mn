import { notion } from '@mountnotion/sdk';
import { MountnCommand, MountNotionConfig } from '@mountnotion/types';
import { ensure, variablize } from '@mountnotion/utils';
import { workspaceHasPages } from '../dependencies';
import { exportCSVFile, getDatabaseIdsInWorkspace } from '../utils';

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
        Object.keys(columns).map((key) => [[variablize(key)], key])
      );

      exportCSVFile(mappings, instances, id);
    }

    return;
  },
} satisfies MountnCommand;
