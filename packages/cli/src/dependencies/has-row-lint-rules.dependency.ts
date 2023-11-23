import { MountNotionConfig } from '@mountnotion/types';
import { workspaceDefined } from './workspace-defined.dependency';

export function hasRowLintRules(config: MountNotionConfig) {
  workspaceDefined(config);
  const hasRules = config?.lint && Object.keys(config.lint).includes('row-');

  if (!hasRules) {
    throw new Error('no rules configured');
  }
}
