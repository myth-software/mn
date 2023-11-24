import { Schema } from '@mountnotion/types';
import { camelize, classify, decamelize, variablize } from './strings.util';

function sortTitleAndRelation(
  tuple: [baseTable: string, relationColumn: string]
) {
  return tuple.sort((a, b) => a.localeCompare(b));
}

export function getJoinTable(
  relatedColumn: string,
  { title: baseTable, relations, syncedColumns }: Schema,
  values?: {
    primaryId: string;
    relatedIds: string[];
  }
) {
  if (!relations) {
    throw new Error('unexpected missing relations');
  }
  const relatedTable = relations[relatedColumn];
  const syncedColumn = syncedColumns?.[relatedColumn];
  const [first, second] = syncedColumn
    ? sortTitleAndRelation([
        variablize(relatedColumn),
        variablize(syncedColumn),
      ])
    : sortTitleAndRelation([baseTable, relatedColumn]);
  const constName = camelize(first) + classify(second);
  const tableName = [first, second].join('_');
  const isRelatedTableFirst = first === variablize(relatedColumn);
  const firstName = isRelatedTableFirst ? relatedTable : baseTable;
  const secondName = isRelatedTableFirst ? baseTable : relatedTable;
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
    baseTable,
    firstValue,
    secondValue,
  };
}
