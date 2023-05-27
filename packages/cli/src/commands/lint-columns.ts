import { notion } from '@mountnotion/sdk';
import { LogInput, MountnCommand } from '@mountnotion/types';
import { EMOJI, printPhraseList } from '../utils';

export default {
  name: 'lint-columns',
  description:
    'lint workspaces’s databases columns for pass or fail against standards',
  options: [],
  actionFactory: () => async () => {
    const page_id = '';
    const allResponses = await notion.blocks.children.listAll({
      block_id: page_id,
      page_size: 100,
    });
    const ids = allResponses
      .flatMap(({ results }) => results as any[])
      .filter((result) => result.type === 'child_database')
      .map(({ id }) => id);
    const missingName: any[] = [];
    const missingLastEditedTime: any[] = [];
    const missingCreatedTime: any[] = [];
    const missingLastEditedBy: any[] = [];
    const missingCreatedBy: any[] = [];
    const missingEmojis: any[] = [];
    const mismatchedSelects: any[] = [];
    const mismatchedMultiselects: any[] = [];
    const missingAllLower: any[] = [];
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
      const title = propertyNames.find((name) => {
        return database.properties[name].type === 'title';
      });
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
          const options: any[] = (database.properties[name] as any).select
            .options;
          const firstOptionColor = options[0].color;

          return !options.every((option) => option.color === firstOptionColor);
        });
      const multiselects = propertyNames
        .filter((name) => {
          return database.properties[name].type === 'multi_select';
        })
        .filter((name) => {
          const options: any[] = (database.properties[name] as any).multi_select
            .options;
          const firstOptionColor = options[0].color;

          return !options.every((option) => option.color === firstOptionColor);
        });

      if (!database.properties['name']) {
        await notion.databases.update({
          database_id,
          properties: {
            [title!]: {
              name: 'name',
            },
          },
        });
        missingName.push({
          database: (database as any).title[0].plain_text,
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
          database: (database as any).title[0].plain_text,
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
          database: (database as any).title[0].plain_text,
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
          database: (database as any).title[0].plain_text,
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
          database: (database as any).title[0].plain_text,
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
          database: (database as any).title[0].plain_text,
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
          database: (database as any).title[0].plain_text,
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
          database: (database as any).title[0].plain_text,
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
          database: (database as any).title[0].plain_text,
          from: null,
          to: 'created by',
        });
      }

      if (relations.length) {
        missingEmojis.push({
          database: (database as any).title[0].plain_text,
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
        const options: any[] = (database.properties[name] as any).select
          .options;
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
          database: (database as any).title[0].plain_text,
          name,
        });

        selects.shift();
      }

      while (multiselects.length !== 0) {
        const name = multiselects[0];
        /**
         * get all the existing options
         */
        const options: any[] = (database.properties[name] as any).multi_select
          .options;
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
          database: (database as any).title[0].plain_text,
          name,
        });

        multiselects.shift();
      }

      if (allLower.length) {
        missingAllLower.push({
          database: (database as any).title[0].plain_text,
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

    console.log('3 databases columns to lint: 🔢 sets, 🔵 overlays, 📝 logs');
    const phraseList: LogInput[] = [
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
