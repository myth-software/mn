import { createDatabaseCaches } from '@mountnotion/sdk';
import { MountnCommand, MountNotionConfig } from '@mountnotion/types';

function dependencies(config: MountNotionConfig) {
  const workspaceDefined = config.workspace;

  if (!workspaceDefined) {
    throw new Error('workspace not defined in .mountnotion.config.json');
  }

  const pagesSelected = config.workspace.selectedPages.length > 0;

  if (!pagesSelected) {
    throw new Error('no pages selected');
  }
}

export default {
  name: 'fetch',
  description: 'fetches databases and builds cache',
  actionFactory: (config) => async () => {
    dependencies(config);

    await createDatabaseCaches(
      config.workspace.selectedPages,
      config.options.basic
    );
  },
} satisfies MountnCommand;
