import { notion } from '@mountnotion/sdk';
import {
  LogInput,
  MountnCommand,
  MultiSelectDatabasePropertyConfigResponse,
  SelectDatabasePropertyConfigResponse,
} from '@mountnotion/types';
import { ensure, getLintColumns, log } from '@mountnotion/utils';
import { getDatabaseIdsInWorkspace, printPhraseList } from '../utils';
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
  const hasSchema = lintColumns !== undefined && lintColumns.length > 1;
  if (!hasSchema) {
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

      if (fix.id === 'column-automatic-last-edited-time') {
        const result = await fixColumnsAutomaticLastEditedTime(fix);
        logs.push(result);
      }

      if (fix.id === 'column-automatic-created-by') {
        const result = await fixColumnsAutomaticCreatedBy(fix);
        logs.push(result);
      }

      if (fix.id === 'column-automatic-created-time') {
        const result = await fixColumnsAutomaticCreatedTime(fix);
        logs.push(result);
      }

      if (fix.id === 'column-automatic-last-edited-by') {
        const result = await fixColumnsAutomaticLastEditedBy(fix);
        logs.push(result);
      }

      if (fix.id === 'column-consistent-created-by') {
        const result = await fixColumnsConsistentCreatedBy(fix);
        logs.push(result);
      }

      if (fix.id === 'column-consistent-created-time') {
        const result = await fixColumnsConsistentCreatedTime(fix);
        logs.push(result);
      }

      if (fix.id === 'column-consistent-last-edited-by') {
        const result = await fixColumnsConsistentLastEditedBy(fix);
        logs.push(result);
      }

      if (fix.id === 'column-consistent-last-edited-time') {
        const result = await fixColumnsConsistentLastEditedTime(fix);
        logs.push(result);
      }

      if (fix.id === 'column-consistent-titles-as-name') {
        const result = await fixColumnsConsistentTitle(fix);
        logs.push(result);
      }

      if (fix.id === 'column-relations-with-leading-emoji') {
        const result = await fixRelationsWithLeadingEmoji(fix);
        logs.push(result);
      }
    }

    const pageId = options.pageId;
    const ids = await getDatabaseIdsInWorkspace(pageId);

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

        logs.push({
          action: 'informing',
          message: 'mismatched select: ' + name,
          page: {
            title: database.title[0].plain_text,
            emoji: database.icon?.type === 'emoji' ? database.icon.emoji : '',
          },
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

        logs.push({
          action: 'informing',
          message: 'mismatched multi select: ' + name,
          page: {
            title: database.title[0].plain_text,
            emoji: database.icon?.type === 'emoji' ? database.icon.emoji : '',
          },
        });

        multiselects.shift();
      }

      if (allLower.length) {
        logs.push({
          action: 'informing',
          message: 'missing all lower: ' + allLower,
          page: {
            title: database.title[0].plain_text,
            emoji: database.icon?.type === 'emoji' ? database.icon.emoji : '',
          },
        });
      }
    }

    logs.forEach(printPhraseList);
  },
} satisfies MountnCommand;
