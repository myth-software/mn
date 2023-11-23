import { MountNotionConfig } from '@mountnotion/types';

export function workspaceDefined(config: MountNotionConfig) {
  const workspaceDefined = config;

  if (!workspaceDefined) {
    throw new Error('workspace not defined in mn.json');
  }
}
