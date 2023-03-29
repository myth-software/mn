// symbol polyfill must go first
import 'symbol-observable';

import { UnsuccessfulWorkflowExecution } from '@angular-devkit/schematics';
import { NodeWorkflow } from '@angular-devkit/schematics/tools';
import * as dotenv from 'dotenv';
import { existsSync } from 'fs';
import * as path from 'path';
import { MountnCommand } from '../types';
import { logger } from '../utils';
import chalk = require('chalk');
dotenv.config();

export default {
  name: 'apply-schematics',
  description: 'applies schematics',
  options: [],
  actionFactory: (config) => async () => {
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

    if (!config) {
      logger.error(`ERROR! missing config file.`);

      return;
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
    let loggingQueue: string[] = [];
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
        (event as any).description == 'alreadyExist'
          ? 'already exists'
          : 'does not exist';

      switch (event.kind) {
        case 'error':
          error = true;

          logger.error(`ERROR! ${eventPath} ${desc}.`);
          break;
        case 'update':
          loggingQueue.push(
            `${chalk.cyan('UPDATE')} ${eventPath} (${
              event.content.length
            } bytes)`
          );
          break;
        case 'create':
          loggingQueue.push(
            `${chalk.green('CREATE')} ${eventPath} (${
              event.content.length
            } bytes)`
          );
          break;
        case 'delete':
          loggingQueue.push(`${chalk.yellow('DELETE')} ${eventPath}`);
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
          loggingQueue.forEach((log) => logger.info(log));
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
        throw 'missing notion integration key. use configure auth.key or set NOTION_INTEGRATION_KEY environment variable';
      }

      for (const schematic of config.schematics) {
        await workflow
          .execute({
            collection: schematic.collection,
            schematic: schematic.name,
            options: {
              ...config.options?.auth,
              ...config.options?.basic,
              ...schematic.options?.auth,
              ...schematic.options?.basic,
            },
          })
          .toPromise();
      }

      if (nothingDone) {
        logger.info('Nothing to be done.');
      }

      return;
    } catch (err) {
      if (err instanceof UnsuccessfulWorkflowExecution) {
        // "See above" because we already printed the error.
        logger.fatal('The Schematic workflow failed. See above.');
      } else {
        logger.fatal(`Error: ${err instanceof Error ? err.message : err}`);
      }

      return;
    }
  },
} satisfies MountnCommand;
