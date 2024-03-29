// symbol polyfill must go first
import 'symbol-observable';

import { UnsuccessfulWorkflowExecution } from '@angular-devkit/schematics';
import { NodeWorkflow } from '@angular-devkit/schematics/tools';
import { LogInput, MountnCommand, MountNotionConfig } from '@mountnotion/types';
import { log } from '@mountnotion/utils';
import * as path from 'path';
import { rimraf } from 'rimraf';
import findUp from '../utils/find-up';

type SchematicsOptions = {
  clearSchema: boolean;
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
    log.error({
      action: 'erroring',
      message: 'missing mount notion config file',
    });
    throw new Error('missing mount notion config file');
  }
}

export default {
  name: 'scheme',
  description: 'applies schematics',
  options: [{ name: '-c, --clear-schema', description: 'clear the schema' }],
  actionFactory: (config) => async (options) => {
    assert(options);
    dependencies(config);

    if (options.clearSchema) {
      await rimraf(`${process.cwd()}/.mountnotion`);
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

    const tsconfigRoot = path.dirname(
      findUp('tsconfig.base.json', process.cwd())!
    );
    /** Create the workflow scoped to the working directory that will be executed with this run. */
    const workflow = new NodeWorkflow(tsconfigRoot, {
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

      const desc =
        (event as { description: string }).description == 'alreadyExist'
          ? 'already exists'
          : 'does not exist';

      switch (event.kind) {
        case 'error':
          error = true;
          log.error({ action: 'erroring', message: `${event.path} ${desc}` });
          break;
        case 'update':
          loggingQueue.push({
            action: 'updating',
            message: `${event.path} (${event.content.length} bytes)`,
          });
          break;
        case 'create':
          loggingQueue.push({
            action: 'creating',
            message: `${event.path} (${event.content.length} bytes)`,
          });

          break;
        case 'delete':
          loggingQueue.push({
            action: 'deleting',
            message: `${event.path}`,
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
          loggingQueue.forEach((input) => log.info(input));
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
      if (config.auth === 'key' && !process.env['NOTION_INTEGRATION_KEY']) {
        log.fatal({
          action: 'erroring',
          message:
            'missing notion integration key. set NOTION_INTEGRATION_KEY environment variable',
        });
      }

      for (const schematic of config.schematics) {
        if (!schematic.disable) {
          await workflow
            .execute({
              collection: '@mountnotion/schematics',
              schematic: schematic.name,
              options: {
                ...config.schematicDefaults,
                ...schematic,
              },
            })
            .toPromise();
        }
      }

      if (nothingDone) {
        log.info({ action: 'informing', message: 'nothing to be done' });
      }

      return;
    } catch (err) {
      if (err instanceof UnsuccessfulWorkflowExecution) {
        // "See above" because we already printed the error.
        log.error({
          action: 'erroring',
          message: 'the schematic workflow failed. see above',
        });
      } else {
        log.error({
          action: 'erroring',
          message: `${err instanceof Error ? err.message : err}`,
        });
      }

      return;
    }
  },
} satisfies MountnCommand;
