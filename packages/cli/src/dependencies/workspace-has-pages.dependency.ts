import { MountNotionConfig } from '@mountnotion/types';
import { log } from '@mountnotion/utils';
import { workspaceDefined } from './workspace-defined.dependency';

export function workspaceHasPages(config: MountNotionConfig) {
  workspaceDefined(config);

  const hasPages = config.workspace.selectedPages?.length > 0;

  if (!hasPages) {
    log.fatal({
      action: 'crashing',
      message: 'no pages selected in workspace',
    });
  }
}
