import {
  Columns,
  PageObjectResponse,
  QueryDatabaseParameters,
  QueryDatabaseResponse,
} from '@mountnotion/types';
import { flattenPageResponses } from '../../flatteners';
import { queryAll } from './query-all';
import { queryAllResults } from './query-all-results';
import { queryResponse } from './query-response';
import { queryResults } from './query-results';

export async function query<Entity>(
  query: QueryDatabaseParameters
): Promise<QueryDatabaseResponse>;
export async function query<Entity>(
  query: QueryDatabaseParameters,
  config?: { all: true }
): Promise<QueryDatabaseResponse[]>;
export async function query<Entity>(
  query: QueryDatabaseParameters,
  config: { resultsOnly: true } | { resultsOnly: true; all: true }
): Promise<PageObjectResponse[]>;
export async function query<Entity>(
  query: QueryDatabaseParameters,
  config:
    | { resultsOnly: true; flattenResponse: true }
    | { resultsOnly: true; flattenResponse: true; all: true }
): Promise<[Entity[], Columns]>;
export async function query<Entity>(
  query: QueryDatabaseParameters,
  config?:
    | { all: true }
    | { resultsOnly: true }
    | { resultsOnly: true; all: true }
    | { resultsOnly: true; flattenResponse: true }
    | { resultsOnly: true; flattenResponse: true; all: true }
) {
  if (!config) {
    return await queryResponse(query);
  }
  const descriptors = Object.getOwnPropertyNames(config);
  if (descriptors.length === 1 && descriptors[0] === 'all') {
    return await queryAll(query);
  }

  if (descriptors.length === 1 && descriptors[0] === 'resultsOnly') {
    return await queryResults(query);
  }

  if (
    descriptors.length === 2 &&
    descriptors.includes('resultsOnly') &&
    descriptors.includes('all')
  ) {
    return await queryAllResults(query);
  }

  if (
    descriptors.length === 2 &&
    descriptors.includes('resultsOnly') &&
    descriptors.includes('flattenResponse')
  ) {
    const results = await queryResults(query);
    const entities = flattenPageResponses<Entity>(results);
    return entities;
  }

  if (
    descriptors.length === 3 &&
    descriptors.includes('resultsOnly') &&
    descriptors.includes('all') &&
    descriptors.includes('flattenResponse')
  ) {
    const results = await queryAllResults(query);
    const entities = flattenPageResponses<Entity>(results);
    return entities;
  }

  return await queryResponse(query);
}
