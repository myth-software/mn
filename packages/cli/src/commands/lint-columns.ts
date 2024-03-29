import { notion } from '@mountnotion/sdk';
import {
  LogInput,
  MountnCommand,
  MountNotionConfig,
  MultiSelectDatabasePropertyConfigResponse,
  SelectDatabasePropertyConfigResponse,
} from '@mountnotion/types';
import { ensure, log } from '@mountnotion/utils';
import { EMOJI, getDatabaseIdsInWorkspace, printPhraseList } from '../utils';
import { lintColumnsAutomaticCreatedBy } from './lint/automatic-created-by-columns.rule';
import { lintColumnsAutomaticCreatedTime } from './lint/automatic-created-time-columns.rule';
import { lintColumnsAutomaticLastEditedBy } from './lint/automatic-last-edited-by-columns.rule';
import { lintColumnsAutomaticLastEditedTime } from './lint/automatic-last-edited-time-columns.rule';
import { lintColumnsConsistentCreatedBy } from './lint/consistent-created-by-columns.rule';
import { lintColumnsConsistentCreatedTime } from './lint/consistent-created-time-columns.rule';
import { lintColumnsConsistentLastEditedBy } from './lint/consistent-last-edited-by-columns.rule';
import { lintColumnsConsistentLastEditedTime } from './lint/consistent-last-edited-time-columns.rule';

type LintColumnsOptions = {
  pageId: string;
};

function assert(
  condition: unknown,
  msg?: string
): asserts condition is LintColumnsOptions {
  if (typeof condition !== 'object') {
    throw new Error(msg);
  }
}

function dependencies(config: MountNotionConfig) {
  const hasRules = config.lint && Object.keys(config.lint).includes('column-');

  if (!hasRules) {
    throw new Error('no rules configured');
  }
}

export default {
  name: 'lint-columns',
  description:
    "lint workspaces's databases columns for pass or fail against lint rules",
  options: [
    { name: '-p, --page-id [id]', description: 'id of page with databases' },
  ],
  actionFactory: (config) => async (options) => {
    assert(options);
    dependencies(config);
    const selectedPages = config.selectedPages;
    const pageId = options.pageId ?? selectedPages[0];
    const ids = await getDatabaseIdsInWorkspace(pageId);

    while (ids.length) {
      const outputs: LogInput[] = [];
      const database_id = ids.splice(0, 1)[0];
      const database = await notion.databases.retrieve({ database_id });

      log.info({
        action: 'informing',
        page: {
          emoji: database.icon?.type === 'emoji' ? database.icon.emoji : '',
          title: database.title[0].plain_text,
        },
        message: `linting`,
      });
      outputs.push(lintColumnsAutomaticCreatedBy(database));
      outputs.push(lintColumnsAutomaticCreatedTime(database));
      outputs.push(lintColumnsAutomaticLastEditedBy(database));
      outputs.push(lintColumnsAutomaticLastEditedTime(database));
      outputs.push(lintColumnsConsistentCreatedBy(database));
      outputs.push(lintColumnsConsistentCreatedTime(database));
      outputs.push(lintColumnsConsistentLastEditedBy(database));
      outputs.push(lintColumnsConsistentLastEditedTime(database));
      const propertyNames = Object.keys(database.properties);

      const title = ensure(
        propertyNames.find((name) => {
          return database.properties[name].type === 'title';
        })
      );
      const relations = propertyNames
        .filter((name) => {
          return database.properties[name].type === 'relation';
        })
        .filter((name) => !EMOJI.includes(name.split(' ')[0]));
      const allLower = propertyNames.filter(
        (name) => name !== name.toLowerCase()
      );
      const selects = propertyNames
        .filter((name) => {
          return database.properties[name].type === 'select';
        })
        .filter((name) => {
          const options = (
            database.properties[name] as SelectDatabasePropertyConfigResponse
          ).select.options;
          const firstOptionColor = options[0].color;

          return !options.every((option) => option.color === firstOptionColor);
        });
      const multiselects = propertyNames
        .filter((name) => {
          return database.properties[name].type === 'multi_select';
        })
        .filter((name) => {
          const options = (
            database.properties[
              name
            ] as MultiSelectDatabasePropertyConfigResponse
          ).multi_select.options;
          const firstOptionColor = options[0].color;

          return !options.every((option) => option.color === firstOptionColor);
        });

      if (!database.properties['name']) {
        outputs.push({
          action: 'fail',
          page: {
            emoji: database.icon?.type === 'emoji' ? database.icon.emoji : '',
            title: database.title[0].plain_text,
          },
          message: `title "${title}" has consistent titles as "name"`,
        });
      }

      if (relations.length) {
        outputs.push({
          action: 'fail',
          page: {
            emoji: database.icon?.type === 'emoji' ? database.icon.emoji : '',
            title: database.title[0].plain_text,
          },
          message: relations.join(', '),
        });
      }

      while (selects.length !== 0) {
        const name = selects[0];

        outputs.push({
          action: 'fail',
          page: {
            emoji: database.icon?.type === 'emoji' ? database.icon.emoji : '',
            title: database.title[0].plain_text,
          },
          message: `mismatchedSelects ${name}`,
        });

        selects.shift();
      }

      while (multiselects.length !== 0) {
        const name = multiselects[0];

        outputs.push({
          action: 'fail',
          page: {
            emoji: database.icon?.type === 'emoji' ? database.icon.emoji : '',
            title: database.title[0].plain_text,
          },
          message: `mismatchedMultiselects ${name}`,
        });

        multiselects.shift();
      }

      if (allLower.length) {
        outputs.push({
          action: 'fail',
          page: {
            emoji: database.icon?.type === 'emoji' ? database.icon.emoji : '',
            title: database.title[0].plain_text,
          },
          message: `missingAllLower ${allLower.join(', ')}`,
        });
      }
      outputs.forEach(printPhraseList);
    }
  },
} satisfies MountnCommand;
