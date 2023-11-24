import { createDatabaseSchema } from '@mountnotion/sdk';
import { MountNotionConfig, MountnCommand, Schema } from '@mountnotion/types';
import { workspaceHasPages } from '../dependencies';

function dependencies(config: MountNotionConfig) {
  workspaceHasPages(config);
}

export default {
  name: 'fetch',
  description: 'fetches databases and builds schema',
  actionFactory: (config) => async () => {
    dependencies(config);

    return await createDatabaseSchema(config);
  },
} satisfies MountnCommand<Schema[]>;
