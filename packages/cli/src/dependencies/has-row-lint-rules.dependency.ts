import { MountNotionConfig } from '@mountnotion/types';
import { workspaceDefined } from './workspace-defined.dependency';

export function hasRowLintRules(config: MountNotionConfig) {
  workspaceDefined(config);
  const hasRules =
    config.workspace?.lint?.rows &&
    Object.keys(config.workspace.lint.rows).length > 0;

  if (!hasRules) {
    throw new Error('no rules configured');
  }
}
