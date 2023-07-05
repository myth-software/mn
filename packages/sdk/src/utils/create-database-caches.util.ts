import {
  BasicOptions,
  BlockObjectResponse,
  Cache,
  Entity,
} from '@mountnotion/types';
import { logInfo } from '@mountnotion/utils';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { flattenDatabaseResponse, flattenPageResponse } from '../flatteners';
import * as infrastructure from '../infrastructure';
import { CACHE } from './constants.util';
import { createRelations } from './create-relations.util';
import { createRollupsOptions } from './create-rollups-options.util';
import { createRollups } from './create-rollups.util';

export const createDatabaseCaches = async (
  pageIds: string[],
  options: BasicOptions
): Promise<Cache[]> => {
  if (!existsSync('./.mountnotion')) {
    mkdirSync('./.mountnotion');
  }

  let cached;
  try {
    cached = readFileSync(CACHE, 'utf8');
    logInfo({ action: 'loading', message: 'data from filesystem cache' });
  } catch (error) {
    logInfo({ action: 'loading', message: 'data from notion workspace' });
  }

  if (cached) {
    return JSON.parse(cached) as Cache[];
  }

  const pageResponse = await infrastructure.pages.retrieve({
    page_id: pageIds[0],
  });
  const [page] = flattenPageResponse<Entity>(pageResponse);
  const promises = pageIds.map((page_id) =>
    infrastructure.blocks.children.listAll({
      block_id: page_id,
      page_size: 100,
    })
  );
  logInfo({
    action: 'listing',
    message: 'page children',
    page: { emoji: page.icon, title: page.title },
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
  logInfo({
    action: 'retrieving',
    message: 'primary databases',
    page: { emoji: page.icon, title: page.title },
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
  logInfo({
    action: 'retrieving',
    message: 'related databases',
    page: { emoji: page.icon, title: page.title },
  });
  const relatedDatabases = await infrastructure.databases.retrieveAll(
    relatedIds
  );
  const allUsableDatabases = primaryDatabases
    .concat(relatedDatabases)
    .filter((database) => !database.archived);

  const pagePromises = allUsableDatabases.map((database) =>
    infrastructure.databases.query<any>(
      { database_id: database.id, page_size: 1 },
      { flattenResponse: true, resultsOnly: true }
    )
  );
  logInfo({
    action: 'querying',
    message: 'primary and related databases',
    page: { emoji: page.icon, title: page.title },
  });
  const nestedPages = await Promise.all(pagePromises);
  const pages = nestedPages.map(([nestedPage]) => nestedPage).flat();
  const allRollupsPromises = allUsableDatabases.map((database, i) =>
    createRollups(database.properties, pages[i].id)
  );
  logInfo({
    action: 'querying',
    message: 'property types',
    page: { emoji: page.icon, title: page.title },
  });
  const allRollups = await Promise.all(allRollupsPromises);

  const caches: Cache[] = allUsableDatabases
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

  logInfo({
    action: 'caching',
    message: '',
    page: { emoji: page.icon, title: page.title },
  });
  writeFileSync(CACHE, JSON.stringify(caches));

  return caches;
};
