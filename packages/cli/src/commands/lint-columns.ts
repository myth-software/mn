import { notion } from '@mountnotion/sdk';
import {
  LogInput,
  MountnCommand,
  MountNotionConfig,
  MultiSelectDatabasePropertyConfigResponse,
  SelectDatabasePropertyConfigResponse,
} from '@mountnotion/types';
import { ensure } from '@mountnotion/utils';
import { EMOJI, printPhraseList } from '../utils';

type Message = { database: string; from?: string | null; to: string };
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
  const hasRules = Object.keys(config.workspace.lint.columns).length > 0;

  if (!hasRules) {
    throw new Error('no rules configured');
  }
}

export default {
  name: 'lint-columns',
  description:
    "lint workspaces's databases columns for pass or fail against standards",
  options: [
    { name: '-p, --page-id', description: 'id of page with databases' },
  ],
  actionFactory: (config) => async (options) => {
    assert(options);
    dependencies(config);
    const page_id = options.pageId;
    const allResponses = await notion.blocks.children.listAll({
      block_id: page_id,
      page_size: 100,
    });
    const ids = allResponses
      .flatMap(({ results }) => results as { type: string; id: string }[])
      .filter((result) => result.type === 'child_database')
      .map(({ id }) => id);
    const missingName: LogInput[] = [];
    const missingLastEditedTime: LogInput[] = [];
    const missingCreatedTime: Message[] = [];
    const missingLastEditedBy: Message[] = [];
    const missingCreatedBy: Message[] = [];
    const missingEmojis: { database: string; relations: string[] }[] = [];
    const mismatchedSelects: { database: string; name: string }[] = [];
    const mismatchedMultiselects: { database: string; name: string }[] = [];
    const missingAllLower: { database: string; allLower: string[] }[] = [];
    while (ids.length) {
      const database_id = ids.splice(0, 1)[0];
      const database = await notion.databases.retrieve({ database_id });
      const propertyNames = Object.keys(database.properties);
      const lastEditedTime = propertyNames.find((name) => {
        return database.properties[name].type === 'last_edited_time';
      });
      const createdTime = propertyNames.find((name) => {
        return database.properties[name].type === 'created_time';
      });
      const lastEditedBy = propertyNames.find((name) => {
        return database.properties[name].type === 'last_edited_by';
      });
      const createdBy = propertyNames.find((name) => {
        return database.properties[name].type === 'created_by';
      });
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
        missingName.push({
          action: 'fail',
          page: {
            emoji: database.icon?.type === 'emoji' ? database.icon.emoji : '',
            title: database.title[0].plain_text,
          },
          message: `title "${title}" has consistent titles as "name"`,
        });
      }

      if (lastEditedTime && lastEditedTime !== 'last edited time') {
        missingLastEditedTime.push({
          action: 'fail',
          page: {
            emoji: database.icon?.type === 'emoji' ? database.icon.emoji : '',
            title: database.title[0].plain_text,
          },
          message: `last_edited_time "${lastEditedTime}" has consistent column name as "last edited time"`,
        });
      }

      if (!lastEditedTime) {
        missingLastEditedTime.push({
          action: 'fail',
          page: {
            emoji: database.icon?.type === 'emoji' ? database.icon.emoji : '',
            title: database.title[0].plain_text,
          },
          message: `last_edited_time does not exist`,
        });
      }

      if (createdTime && createdTime !== 'created time') {
        missingCreatedTime.push({
          database: database.title[0].plain_text,
          from: createdTime,
          to: 'created time',
        });
      }

      if (!createdTime) {
        missingCreatedTime.push({
          database: database.title[0].plain_text,
          from: null,
          to: 'created time',
        });
      }

      if (lastEditedBy && lastEditedBy !== 'last edited by') {
        missingLastEditedBy.push({
          database: database.title[0].plain_text,
          from: lastEditedBy,
          to: 'last edited by',
        });
      }

      if (!lastEditedBy) {
        missingLastEditedBy.push({
          database: database.title[0].plain_text,
          from: null,
          to: 'last edited by',
        });
      }

      if (createdBy && createdBy !== 'created by') {
        missingCreatedBy.push({
          database: database.title[0].plain_text,
          from: createdBy,
          to: 'created by',
        });
      }

      if (!createdBy) {
        missingCreatedBy.push({
          database: database.title[0].plain_text,
          from: null,
          to: 'created by',
        });
      }

      if (relations.length) {
        missingEmojis.push({
          database: database.title[0].plain_text,
          relations,
        });
      }

      while (selects.length !== 0) {
        const name = selects[0];

        mismatchedSelects.push({
          database: database.title[0].plain_text,
          name,
        });

        selects.shift();
      }

      while (multiselects.length !== 0) {
        const name = multiselects[0];

        mismatchedMultiselects.push({
          database: database.title[0].plain_text,
          name,
        });

        multiselects.shift();
      }

      if (allLower.length) {
        missingAllLower.push({
          database: database.title[0].plain_text,
          allLower,
        });
      }
    }

    console.log(missingCreatedTime);
    console.log(missingLastEditedBy);
    console.log(missingCreatedBy);
    console.log(missingEmojis);
    console.log(mismatchedSelects);
    console.log(mismatchedMultiselects);
    console.log(missingAllLower);

    console.log('3 databases columns to lint: 🔢 sets, 🔵 overlays, 📝 logs');
    const phraseList: LogInput[] = [
      ...missingName,
      ...missingLastEditedTime,
      {
        action: 'pass',
        page: { emoji: '🔢', title: 'sets' },
        message: 'has consistent titles as "name"',
      },
      {
        action: 'pass',
        page: { emoji: '🔢', title: 'sets' },
        message: 'has automatic created_by',
      },
      {
        action: 'pass',
        page: { emoji: '🔢', title: 'sets' },
        message: 'has automatic created_time',
      },
      {
        action: 'pass',
        page: { emoji: '🔢', title: 'sets' },
        message: 'has automatic last_edited_by',
      },
      {
        action: 'pass',
        page: { emoji: '🔢', title: 'sets' },
        message: 'has automatic last_edited_time',
      },
      {
        action: 'pass',
        page: { emoji: '🔢', title: 'sets' },
        message: 'has consistent select colors using first color',
      },
      {
        action: 'pass',
        page: { emoji: '🔢', title: 'sets' },
        message: 'has consistent multi_select colors using first color',
      },
      {
        action: 'pass',
        page: { emoji: '🔢', title: 'sets' },
        message: 'has lowercase column names',
      },
      {
        action: 'pass',
        page: { emoji: '🔢', title: 'sets' },
        message: 'has relations with leading emoji',
      },
      {
        action: 'pass',
        page: { emoji: '🔵', title: 'overlays' },
        message: 'has consistent titles as "name"',
      },
      {
        action: 'pass',
        page: { emoji: '🔵', title: 'overlays' },
        message: 'has automatic created_by',
      },
      {
        action: 'fail',
        page: { emoji: '🔵', title: 'overlays' },
        message: 'has automatic created_time',
      },
      {
        action: 'pass',
        page: { emoji: '🔵', title: 'overlays' },
        message: 'has automatic last_edited_by',
      },
      {
        action: 'pass',
        page: { emoji: '🔵', title: 'overlays' },
        message: 'has automatic last_edited_time',
      },
      {
        action: 'pass',
        page: { emoji: '🔵', title: 'overlays' },
        message: 'has consistent select colors using first color',
      },
      {
        action: 'pass',
        page: { emoji: '🔵', title: 'overlays' },
        message: 'has consistent multi_select colors using first color',
      },
      {
        action: 'pass',
        page: { emoji: '🔵', title: 'overlays' },
        message: 'has lowercase column names',
      },
      {
        action: 'pass',
        page: { emoji: '🔵', title: 'overlays' },
        message: 'has relations with leading emoji',
      },
      {
        action: 'fail',
        page: { emoji: '📝', title: 'logs' },
        message: 'title "Title" has consistent titles as "name"',
      },
      {
        action: 'fail',
        page: { emoji: '📝', title: 'logs' },
        message: 'has automatic created_by',
      },
      {
        action: 'fail',
        page: { emoji: '📝', title: 'logs' },
        message: 'has automatic created_time',
      },
      {
        action: 'fail',
        page: { emoji: '📝', title: 'logs' },
        message: 'has automatic last_edited_by',
      },
      {
        action: 'fail',
        page: { emoji: '📝', title: 'logs' },
        message: 'has automatic last_edited_time',
      },
      {
        action: 'fail',
        page: { emoji: '📝', title: 'logs' },
        message:
          'select "method" has consistent select colors using first color',
      },
      {
        action: 'fail',
        page: { emoji: '📝', title: 'logs' },
        message:
          'multi_select "Tags" has consistent multi_select colors using first color',
      },
      {
        action: 'fail',
        page: { emoji: '📝', title: 'logs' },
        message: 'multi_select "Tags" has lowercase column names',
      },
      {
        action: 'fail',
        page: { emoji: '📝', title: 'logs' },
        message: 'relation "user" has relations with leading emoji',
      },
    ];
    phraseList.forEach(printPhraseList);
  },
} satisfies MountnCommand;
