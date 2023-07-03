import { notion } from '@mountnotion/sdk';
import {
  LogInput,
  MountnCommand,
  MultiSelectDatabasePropertyConfigResponse,
  SelectDatabasePropertyConfigResponse,
} from '@mountnotion/types';
import { ensure } from '@mountnotion/utils';
import { EMOJI, printPhraseList } from '../utils';

type Message = { database: string; from?: string | null; to: string };
type FixColumnsOptions = {
  pageId: string;
};

function assert(
  condition: unknown,
  msg?: string
): asserts condition is FixColumnsOptions {
  if (typeof condition !== 'object') {
    throw new Error(msg);
  }
}

function dependencies() {
  const cache: Array<any> = [];
  const databasesWithColumnsFails = cache.filter(
    (database) => database.lintFails.columns.length > 0
  );
  const canFix = databasesWithColumnsFails.length > 1;

  if (!canFix) {
    throw new Error('no columns to fix');
  }
}

export default {
  name: 'fix-columns',
  description: 'fixes any columns that failed linting',
  options: [],
  actionFactory: () => async (options) => {
    assert(options);
    dependencies();
    const page_id = options.pageId;
    const allResponses = await notion.blocks.children.listAll({
      block_id: page_id,
      page_size: 100,
    });
    const ids = allResponses
      .flatMap(({ results }) => results as { type: string; id: string }[])
      .filter((result) => result.type === 'child_database')
      .map(({ id }) => id);
    const missingName: Message[] = [];
    const missingLastEditedTime: Message[] = [];
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
        await notion.databases.update({
          database_id,
          properties: {
            [title]: {
              name: 'name',
            },
          },
        });
        missingName.push({
          database: database.title[0].plain_text,
          from: title,
          to: 'name',
        });
      }

      if (lastEditedTime && lastEditedTime !== 'last edited time') {
        await notion.databases.update({
          database_id,
          properties: {
            [lastEditedTime]: {
              name: 'last edited time',
            },
          },
        });
        missingLastEditedTime.push({
          database: database.title[0].plain_text,
          from: lastEditedTime,
          to: 'last edited time',
        });
      }

      if (!lastEditedTime) {
        await notion.databases.update({
          database_id,
          properties: {
            'last edited time': {
              last_edited_time: {},
              name: 'last edited time',
              type: 'last_edited_time',
            },
          },
        });

        missingLastEditedTime.push({
          database: database.title[0].plain_text,
          from: null,
          to: 'last edited time',
        });
      }

      if (createdTime && createdTime !== 'created time') {
        await notion.databases.update({
          database_id,
          properties: {
            [createdTime]: {
              name: 'created time',
            },
          },
        });

        missingCreatedTime.push({
          database: database.title[0].plain_text,
          from: createdTime,
          to: 'created time',
        });
      }

      if (!createdTime) {
        await notion.databases.update({
          database_id,
          properties: {
            'created time': {
              created_time: {},
              name: 'created time',
              type: 'created_time',
            },
          },
        });

        missingCreatedTime.push({
          database: database.title[0].plain_text,
          from: null,
          to: 'created time',
        });
      }

      if (lastEditedBy && lastEditedBy !== 'last edited by') {
        await notion.databases.update({
          database_id,
          properties: {
            [lastEditedBy]: {
              name: 'last edited by',
            },
          },
        });
        missingLastEditedBy.push({
          database: database.title[0].plain_text,
          from: lastEditedBy,
          to: 'last edited by',
        });
      }

      if (!lastEditedBy) {
        await notion.databases.update({
          database_id,
          properties: {
            'last edited by': {
              last_edited_by: {},
              name: 'last edited by',
              type: 'last_edited_by',
            },
          },
        });

        missingLastEditedBy.push({
          database: database.title[0].plain_text,
          from: null,
          to: 'last edited by',
        });
      }

      if (createdBy && createdBy !== 'created by') {
        await notion.databases.update({
          database_id,
          properties: {
            [createdBy]: {
              name: 'created by',
            },
          },
        });

        missingCreatedBy.push({
          database: database.title[0].plain_text,
          from: createdBy,
          to: 'created by',
        });
      }

      if (!createdBy) {
        await notion.databases.update({
          database_id,
          properties: {
            'created by': {
              created_by: {},
              name: 'created by',
              type: 'created_by',
            },
          },
        });

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
        /**
         * get all the existing pages
         * NOTE: curiously unnecessary
         */
        // const pages = await notion.databases.query(
        //   { database_id: database_id },
        //   { all: true, resultsOnly: true, flattenResponse: true },
        // );
        // const page = (pages as any[])[0];
        // const [, properties] = (await notion.pages.retrieve(
        //   {
        //     page_id: page.page_id,
        //   },
        //   { flattenResponse: true },
        // )) as [unknown, Properties];

        /**
         * get all the existing options
         */
        const options = (
          database.properties[name] as SelectDatabasePropertyConfigResponse
        ).select.options;
        const firstOptionColor = options[0].color;
        const updatedOptions = options.map((option) => ({
          name: option.name,
          color: firstOptionColor,
        }));

        /**
         * delete all existing options
         */
        await notion.databases.update({
          database_id,
          properties: {
            [name]: {
              select: {
                options: [],
              },
              type: 'select',
            },
          },
        });
        /**
         * create new options with consistent color
         */
        await notion.databases.update({
          database_id,
          properties: {
            [name]: {
              select: {
                options: updatedOptions,
              },
              type: 'select',
            },
          },
        });
        /**
         * reapply options to existing pages
         * NOTE: curiously unnecessary
         */
        // while ((pages as any[]).length) {
        //   const currentPage = (pages as any[])[0];
        //   await notion.pages.update({
        //     page_id: currentPage.page_id,
        //     properties: expandProperties(currentPage, { properties }),
        //   });

        //   (pages as any[]).shift();
        // }

        mismatchedSelects.push({
          database: database.title[0].plain_text,
          name,
        });

        selects.shift();
      }

      while (multiselects.length !== 0) {
        const name = multiselects[0];
        /**
         * get all the existing options
         */
        const options = (
          database.properties[name] as MultiSelectDatabasePropertyConfigResponse
        ).multi_select.options;
        const firstOptionColor = options[0].color;
        const updatedOptions = options.map((option) => ({
          name: option.name,
          color: firstOptionColor,
        }));

        /**
         * delete all existing options
         */
        await notion.databases.update({
          database_id,
          properties: {
            [name]: {
              multi_select: {
                options: [],
              },
              type: 'multi_select',
            },
          },
        });
        /**
         * create new options with consistent color
         */
        await notion.databases.update({
          database_id,
          properties: {
            [name]: {
              multi_select: {
                options: updatedOptions,
              },
              type: 'multi_select',
            },
          },
        });
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
    console.log(missingName);
    console.log(missingLastEditedTime);
    console.log(missingCreatedTime);
    console.log(missingLastEditedBy);
    console.log(missingCreatedBy);
    console.log(missingEmojis);
    console.log(mismatchedSelects);
    console.log(mismatchedMultiselects);
    console.log(missingAllLower);

    console.log('2 databases columns to fix: 🔢 sets, 📝 logs');
    const phraseList: LogInput[] = [
      {
        action: 'create',
        page: { emoji: '🔵', title: 'overlays' },
        message: 'created_time as "created time"',
      },
      {
        action: 'update',
        page: { emoji: '📝', title: 'logs' },
        message: 'title "Title" to "name"',
      },
      {
        action: 'create',
        page: { emoji: '📝', title: 'logs' },
        message: 'created_by as "created by"',
      },
      {
        action: 'create',
        page: { emoji: '📝', title: 'logs' },
        message: 'created_time as "created time"',
      },
      {
        action: 'create',
        page: { emoji: '📝', title: 'logs' },
        message: 'created_last_edited_by as "last edited by"',
      },
      {
        action: 'create',
        page: { emoji: '📝', title: 'logs' },
        message: 'last_edited_time as "last edited time"',
      },
      {
        action: 'update',
        page: { emoji: '📝', title: 'logs' },
        message: 'select "method" colors to brown',
      },
      {
        action: 'update',
        page: { emoji: '📝', title: 'logs' },
        message: 'multi_select "Tags" colors to green',
      },
      {
        action: 'update',
        page: { emoji: '📝', title: 'logs' },
        message: 'multi_select "Tags" to "tags"',
      },
      {
        action: 'warn',
        page: { emoji: '📝', title: 'logs' },
        message:
          'relation "user" cannot automatically be updated to "🙂 user". manual update in notion is required.',
      },
    ];
    phraseList.forEach(printPhraseList);
  },
} satisfies MountnCommand;
