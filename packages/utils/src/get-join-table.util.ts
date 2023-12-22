import { Schema } from '@mountnotion/types';
import { camelize, classify, decamelize, variablize } from './strings.util';

/**
 * Sorts the title and relation column in alphabetical order.
 * @param tuple - A tuple containing the base table and relation column.
 * @returns The sorted tuple.
 */
function sortTitleAndRelation(
  tuple: [baseTable: string, relationColumn: string]
) {
  return tuple.sort((a, b) => a.localeCompare(b));
}

/**
 * Retrieves the join table information based on the provided parameters.
 * @param relatedColumn - The column name of the related table.
 * @param scheme - The notion scheme containing information about the base table, relations, and synced columns.
 * @param values - Optional values object containing the primary ID and related IDs.
 * @returns An object containing the join table information.
 * @throws Error if the relations property is missing in the scheme object.
 */
export function getJoinTable(
  relatedColumn: string,
  scheme: Schema,
  values?: {
    primaryId: string;
    relatedIds: string[];
  }
) {
  if (!scheme.relations) {
    throw new Error('unexpected missing relations');
  }
  const relatedTable = scheme.relations[relatedColumn];
  const syncedColumn = scheme.syncedColumns?.[relatedColumn];
  const [first, second] = syncedColumn
    ? sortTitleAndRelation([
        variablize(relatedColumn),
        variablize(syncedColumn),
      ])
    : sortTitleAndRelation([scheme.title, relatedColumn]);
  const constName = camelize(first) + classify(second);
  const tableName = [first, second].join('_');
  const isRelatedTableFirst = first === variablize(relatedColumn);
  const firstName = isRelatedTableFirst ? relatedTable : scheme.title;
  const secondName = isRelatedTableFirst ? scheme.title : relatedTable;
  const firstValue = isRelatedTableFirst
    ? values?.relatedIds
    : values?.primaryId;
  const secondValue = isRelatedTableFirst
    ? values?.primaryId
    : values?.relatedIds;
  return {
    constName: variablize(constName),
    tableName: decamelize(tableName),
    first,
    second,
    firstId: variablize(first + 'Id'),
    secondId: variablize(second + 'Id'),
    firstName: variablize(firstName),
    secondName: variablize(secondName),
    relatedColumn,
    baseTable: scheme.title,
    firstValue,
    secondValue,
    primaryId: values?.primaryId,
    relatedIds: values?.relatedIds,
    isRelatedTableFirst,
  };
}
