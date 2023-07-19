import { notion } from '@mountnotion/sdk';
import {
  LogInput,
  MountnCommand,
  MultiSelectDatabasePropertyConfigResponse,
  SelectDatabasePropertyConfigResponse,
} from '@mountnotion/types';
import { ensure, getLintColumns, log } from '@mountnotion/utils';
import { printPhraseList } from '../utils';
import {
  fixColumnsAutomaticCreatedBy,
  fixColumnsAutomaticCreatedTime,
  fixColumnsAutomaticLastEditedBy,
  fixColumnsAutomaticLastEditedTime,
  fixColumnsConsistentCreatedBy,
  fixColumnsConsistentCreatedTime,
  fixColumnsConsistentLastEditedBy,
  fixColumnsConsistentLastEditedTime,
  fixColumnsConsistentTitle,
  fixRelationsWithLeadingEmoji,
} from './fix';

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
  const lintColumns = getLintColumns();
  const hasCache = lintColumns !== undefined && lintColumns.length > 1;
  if (!hasCache) {
    log.fatal({
      action: 'aborting',
      message: 'no columns to fix',
    });
  }
}

export default {
  name: 'fix-columns',
  description: 'fixes any columns that have lint errors',
  options: [],
  actionFactory: () => async (options) => {
    assert(options);
    dependencies();
    const fixes = ensure(getLintColumns());
    const logs: LogInput[] = [];

    while (fixes.length > 0) {
      const fix = ensure(fixes.shift());

      if (fix.id === 'automaticLastEditedTime') {
        const result = await fixColumnsAutomaticLastEditedTime(fix);
        logs.push(result);
      }

      if (fix.id === 'automaticCreatedBy') {
        const result = await fixColumnsAutomaticCreatedBy(fix);
        logs.push(result);
      }

      if (fix.id === 'automaticCreatedTime') {
        const result = await fixColumnsAutomaticCreatedTime(fix);
        logs.push(result);
      }

      if (fix.id === 'automaticLastEditedBy') {
        const result = await fixColumnsAutomaticLastEditedBy(fix);
        logs.push(result);
      }

      if (fix.id === 'consistentCreatedBy') {
        const result = await fixColumnsConsistentCreatedBy(fix);
        logs.push(result);
      }

      if (fix.id === 'consistentCreatedTime') {
        const result = await fixColumnsConsistentCreatedTime(fix);
        logs.push(result);
      }

      if (fix.id === 'consistentLastEditedBy') {
        const result = await fixColumnsConsistentLastEditedBy(fix);
        logs.push(result);
      }

      if (fix.id === 'consistentLastEditedTime') {
        const result = await fixColumnsConsistentLastEditedTime(fix);
        logs.push(result);
      }

      if (fix.id === 'consistentTitlesAsName') {
        const result = await fixColumnsConsistentTitle(fix);
        logs.push(result);
      }

      if (fix.id === 'relationsWithLeadingEmoji') {
        const result = await fixRelationsWithLeadingEmoji(fix);
        logs.push(result);
      }
    }

    const page_id = options.pageId;
    const allResponses = await notion.blocks.children.listAll({
      block_id: page_id,
      page_size: 100,
    });
    const ids = allResponses
      .flatMap(({ results }) => results as { type: string; id: string }[])
      .filter((result) => result.type === 'child_database')
      .map(({ id }) => id);

    const missingEmojis: { database: string; relations: string[] }[] = [];
    const mismatchedSelects: { database: string; name: string }[] = [];
    const mismatchedMultiselects: { database: string; name: string }[] = [];
    const missingAllLower: { database: string; allLower: string[] }[] = [];
    while (ids.length) {
      const database_id = ids.splice(0, 1)[0];
      const database = await notion.databases.retrieve({ database_id });
      const propertyNames = Object.keys(database.properties);

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
    console.log(missingEmojis);
    console.log(mismatchedSelects);
    console.log(mismatchedMultiselects);
    console.log(missingAllLower);

    console.log('2 databases columns to fix: 🔢 sets, 📝 logs');
    const phraseList: LogInput[] = [
      ...logs,
      {
        action: 'update',
        page: { emoji: '📝', title: 'logs' },
        message: 'title "Title" to "name"',
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
    ];
    phraseList.forEach(printPhraseList);
  },
} satisfies MountnCommand;
