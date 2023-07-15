import { MountNotionConfig } from '@mountnotion/types';
import { workspaceDefined } from './workspace-defined.dependency';

export function workspaceHasPages(config: MountNotionConfig) {
  workspaceDefined(config);

  const hasPages = config.workspace.selectedPages.length > 0;

  if (!hasPages) {
    throw new Error('no pages selected');
  }
}
