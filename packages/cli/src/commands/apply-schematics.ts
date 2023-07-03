// symbol polyfill must go first
import 'symbol-observable';

import { UnsuccessfulWorkflowExecution } from '@angular-devkit/schematics';
import { NodeWorkflow } from '@angular-devkit/schematics/tools';
import { LogInput, MountnCommand, MountNotionConfig } from '@mountnotion/types';
import { logError, logInfo } from '@mountnotion/utils';
import * as dotenv from 'dotenv';
import { existsSync } from 'fs';
import * as path from 'path';
import { rimraf } from 'rimraf';
dotenv.config();

type SchematicsOptions = {
  clearCache: boolean;
};

function assert(
  condition: unknown,
  msg?: string
): asserts condition is SchematicsOptions {
  if (typeof condition !== 'object') {
    throw new Error(msg);
  }
}

function dependencies(config: MountNotionConfig) {
  if (!config) {
    logError({
      action: 'erroring',
      message: 'missing mount notion config file',
    });
    throw new Error('missing mount notion config file');
  }
}

export default {
  name: 'apply-schematics',
  description: 'applies schematics',
  options: [{ name: '-c, --clear-cache', description: 'clear the cache' }],
  actionFactory: (config) => async (options) => {
    assert(options);
    dependencies(config);

    if (options.clearCache) {
      await rimraf(`${process.cwd()}/.mountnotion`);
    }

    function findUp(names: string | string[], from: string) {
      if (!Array.isArray(names)) {
        names = [names];
      }
      const root = path.parse(from).root;

      let currentDir = from;
      while (currentDir && currentDir !== root) {
        for (const name of names) {
          const p = path.join(currentDir, name);
          if (existsSync(p)) {
            return p;
          }
        }

        currentDir = path.dirname(currentDir);
      }

      return null;
    }

    /**
     * return package manager' name by lock file
     */
    function getPackageManagerName() {
      // order by check priority
      const LOCKS: Record<string, string> = {
        'package-lock.json': 'npm',
        'yarn.lock': 'yarn',
        'pnpm-lock.yaml': 'pnpm',
      };
      const lockPath = findUp(Object.keys(LOCKS), process.cwd());
      if (lockPath) {
        return LOCKS[path.basename(lockPath)];
      }

      return 'npm';
    }

    /** Create the workflow scoped to the working directory that will be executed with this run. */
    const workflow = new NodeWorkflow(process.cwd(), {
      resolvePaths: [process.cwd(), __dirname],
      schemaValidation: true,
      packageManager: getPackageManagerName(),
    });

    // Indicate to the user when nothing has been done. This is automatically set to off when there's
    // a new DryRunEvent.
    let nothingDone = true;

    // Logging queue that receives all the messages to show the users. This only get shown when no
    // errors happened.
    let loggingQueue: LogInput[] = [];
    let error = false;

    /**
     * Logs out dry run events.
     *
     * All events will always be executed here, in order of discovery. That means that an error would
     * be shown along other events when it happens. Since errors in workflows will stop the Observable
     * from completing successfully, we record any events other than errors, then on completion we
     * show them.
     *
     * This is a simple way to only show errors when an error occur.
     */
    workflow.reporter.subscribe((event) => {
      nothingDone = false;
      // Strip leading slash to prevent confusion.
      const eventPath = event.path.startsWith('/')
        ? event.path.slice(1)
        : event.path;

      const desc =
        (event as { description: string }).description == 'alreadyExist'
          ? 'already exists'
          : 'does not exist';

      switch (event.kind) {
        case 'error':
          error = true;
          logError({ action: 'erroring', message: `${eventPath} ${desc}` });
          break;
        case 'update':
          loggingQueue.push({
            action: 'updating',
            message: `${eventPath} (${event.content.length} bytes)`,
          });
          break;
        case 'create':
          loggingQueue.push({
            action: 'creating',
            message: `${eventPath} (${event.content.length} bytes)`,
          });

          break;
        case 'delete':
          loggingQueue.push({
            action: 'deleting',
            message: `${eventPath}`,
          });
          break;
      }
    });

    /**
     * Listen to lifecycle events of the workflow to flush the logs between each phases.
     */
    workflow.lifeCycle.subscribe((event) => {
      if (event.kind == 'workflow-end' || event.kind == 'post-tasks-start') {
        if (!error) {
          // Flush the log queue and clean the error state.
          loggingQueue.forEach((input) => logInfo(input));
        }

        loggingQueue = [];
        error = false;
      }
    });

    /**
     *  Execute the workflow, which will report the dry run events, run the tasks, and complete
     *  after all is done.
     *
     *  The Observable returned will properly cancel the workflow if unsubscribed, error out if ANY
     *  step of the workflow failed (sink or task), with details included, and will only complete
     *  when everything is done.
     */
    try {
      if (config.auth?.key) {
        process.env['NOTION_INTEGRATION_KEY'] = config.auth.key;
      }

      if (!process.env['NOTION_INTEGRATION_KEY']) {
        logError({
          action: 'erroring',
          message:
            'missing notion integration key. use configure auth.key or set NOTION_INTEGRATION_KEY environment variable',
        });
        throw new Error('bailing out');
      }

      for (const schematic of config.schematics) {
        if (!schematic.disable) {
          await workflow
            .execute({
              collection: '@mountnotion/schematics',
              schematic: schematic.name,
              options: {
                ...config.options,
                ...config.options?.auth,
                ...config.options?.basic,
                ...schematic.options,
                ...schematic.options?.auth,
                ...schematic.options?.basic,
              },
            })
            .toPromise();
        }
      }

      if (nothingDone) {
        logInfo({ action: 'informing', message: 'nothing to be done' });
      }

      return;
    } catch (err) {
      if (err instanceof UnsuccessfulWorkflowExecution) {
        // "See above" because we already printed the error.
        logError({
          action: 'erroring',
          message: 'the schematic workflow failed. see above',
        });
      } else {
        logError({
          action: 'erroring',
          message: `${err instanceof Error ? err.message : err}`,
        });
      }

      return;
    }
  },
} satisfies MountnCommand;
