import { createDatabaseCaches } from '@mountnotion/sdk';
import { Cache, MountnCommand, MountNotionConfig } from '@mountnotion/types';
import { workspaceHasPages } from '../dependencies';

function dependencies(config: MountNotionConfig) {
  workspaceHasPages(config);
}

export default {
  name: 'fetch',
  description: 'fetches databases and builds cache',
  actionFactory: (config) => async () => {
    dependencies(config);

    return await createDatabaseCaches(config);
  },
} satisfies MountnCommand<Cache[]>;
