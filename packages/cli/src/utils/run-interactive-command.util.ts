import { spawn } from 'child_process';

export default async function runInteractiveCommand(
  command: string,
  args: string[]
) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit' });

    child.on('error', (err) => {
      reject(err);
    });

    child.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Command "${command}" failed with exit code ${code}`));
      } else {
        resolve();
      }
    });
  });
}
