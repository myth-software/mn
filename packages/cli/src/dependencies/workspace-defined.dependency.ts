import { MountNotionConfig } from '@mountnotion/types';

export function workspaceDefined(config: MountNotionConfig) {
  const workspaceDefined = config.workspace;

  if (!workspaceDefined) {
    throw new Error('workspace not defined in .mountnotion.config.json');
  }
}
