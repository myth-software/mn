import { log } from '@mountnotion/utils';
import { appendFileSync, readFileSync } from 'fs';

export default function ensureGitignore() {
  // Check if .mountnotion is included in .gitignore
  const gitignorePath = `${process.cwd()}/.gitignore`;
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
