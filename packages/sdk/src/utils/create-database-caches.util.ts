import {
  BasicOptions,
  BlockObjectResponse,
  Cache,
  FlatDatabase,
} from '@mountnotion/types';
import { CACHE, log } from '@mountnotion/utils';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { flattenDatabaseResponse, flattenPageResponse } from '../flatteners';
import * as infrastructure from '../infrastructure';
import { createRelations } from './create-relations.util';
import { createRollupsOptions } from './create-rollups-options.util';
import { createRollups } from './create-rollups.util';

export const createDatabaseCaches = async (
  pageIds: Array<string>,
  options: BasicOptions
): Promise<Array<FlatDatabase>> => {
  if (!existsSync('./.mountnotion')) {
    mkdirSync('./.mountnotion');
  }

  log.info({ action: 'loading', message: 'data from notion workspace' });

  const pageResponse = await infrastructure.pages.retrieve({
    page_id: pageIds[0],
  });
  const [cache] = flattenPageResponse<Cache>(pageResponse);
  const promises = pageIds.map((page_id) =>
    infrastructure.blocks.children.listAll({
      block_id: page_id,
      page_size: 100,
    })
  );
  log.info({
    action: 'listing',
    message: 'page children',
    page: { emoji: cache.icon, title: cache.title },
  });
  const allResponses = (await Promise.all(promises)).flat();

  const results = allResponses.flatMap(
    (response) => response.results as BlockObjectResponse[]
  );
  const allParagraphIds = results
    .filter((result: any) => {
      const isParagraph = result.type === 'paragraph';
      const hasDatabase =
        isParagraph && result.paragraph.rich_text?.[0]?.mention?.database?.id;
      return hasDatabase;
    })
    .map((result: any) => result.paragraph.rich_text[0].mention?.database.id);
  const allPrimaryIds = results
    .filter((result) => result.type === 'child_database')
    .map(({ id }) => id);
  const primaryIds = [...new Set(allPrimaryIds.concat(allParagraphIds))];
  log.info({
    action: 'retrieving',
    message: 'primary databases',
    page: { emoji: cache.icon, title: cache.title },
  });
  const primaryDatabases = await infrastructure.databases.retrieveAll(
    primaryIds
  );

  const allRelatedIds = primaryDatabases.flatMap(({ properties }) =>
    Object.values(properties)
      .filter((value: any) => value.type === 'relation')
      .map((value: any) => value.relation.database_id)
  );
  const relatedIds = [
    ...new Set(
      allRelatedIds.filter((relatedId) => !primaryIds.includes(relatedId))
    ),
  ] as string[];
  log.info({
    action: 'retrieving',
    message: 'related databases',
    page: { emoji: cache.icon, title: cache.title },
  });
  const relatedDatabases = await infrastructure.databases.retrieveAll(
    relatedIds
  );
  const allUsableDatabases = primaryDatabases
    .concat(relatedDatabases)
    .filter((database) => !database.archived);
  allUsableDatabases.forEach((database) => {
    log.info({
      action: 'informing',
      message: 'found',
      page: {
        emoji: database.icon?.type === 'emoji' ? database.icon.emoji : '',
        title: database.title[0].plain_text,
      },
    });
  });

  const pagePromises = allUsableDatabases.map((database) =>
    infrastructure.databases.query<any>(
      { database_id: database.id, page_size: 1 },
      { flattenResponse: true, resultsOnly: true }
    )
  );
  log.info({
    action: 'querying',
    message: 'primary and related databases',
    page: { emoji: cache.icon, title: cache.title },
  });
  const nestedPages = await Promise.all(pagePromises);
  const pages = nestedPages.map(([nestedPage]) => nestedPage).flat();
  if (pages.length < allUsableDatabases.length) {
    log.fatal({
      action: 'failing',
      message: `found ${allUsableDatabases.length} databases and ${pages.length} pages. these amounts should match. do all of your databases have pages?`,
    });
  }
  const allRollupsPromises = allUsableDatabases.map((database, i) =>
    createRollups(database.properties, pages[i].id)
  );
  log.info({
    action: 'querying',
    message: 'property types',
    page: { emoji: cache.icon, title: cache.title },
  });
  const allRollups = await Promise.all(allRollupsPromises);

  const caches: FlatDatabase[] = allUsableDatabases
    .map((database) => {
      return flattenDatabaseResponse(database, options);
    })
    .map((flatDatabase, i, flatDatabases) => {
      const rollups = allRollups[i];
      return {
        ...flatDatabase,
        rollups,
        rollupsOptions: createRollupsOptions(
          rollups,
          allUsableDatabases[i].properties,
          flatDatabases
        ),
        relations: createRelations(
          allUsableDatabases[i].properties,
          flatDatabases
        ),
      };
    });

  log.info({
    action: 'caching',
    message: '',
    page: { emoji: cache.icon, title: cache.title },
  });
  writeFileSync(CACHE, JSON.stringify(caches));

  return caches;
};
