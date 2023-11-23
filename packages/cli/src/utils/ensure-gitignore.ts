import { log } from '@mountnotion/utils';
import { appendFileSync, readFileSync } from 'fs';
import findUp from './find-up';

export default function ensureGitignore() {
  // Check if .mountnotion is included in .gitignore
  const gitignorePath = findUp('.gitignore', process.cwd());
  if (!gitignorePath) {
    throw log.fatal({
      action: 'failing',
      message: 'gitignore not found in project',
    });
  }

  const gitignoreContent = readFileSync(gitignorePath, 'utf-8');
  if (!gitignoreContent.includes('.mountnotion')) {
    // add .mountnotion to .gitignore
    appendFileSync(gitignorePath, '\n.mountnotion\n');
    log.info({
      action: 'informing',
      message: '.mountnotion added to .gitignore',
    });
  }
}
