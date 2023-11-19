import { Cache } from '@mountnotion/types';
import { camelize, classify, decamelize, variablize } from './strings.util';

function sortTitleAndRelation(
  tuple: [baseTable: string, relationColumn: string]
) {
  return tuple.sort((a, b) => a.localeCompare(b));
}

export function getJoinTable(
  relatedColumn: string,
  { title: baseTable, relations, syncedColumns }: Cache
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
  const firstName =
    first === variablize(relatedColumn) ? relatedTable : baseTable;
  const secondName = firstName === baseTable ? relatedTable : baseTable;
  return {
    constName: variablize(constName),
    tableName: decamelize(tableName),
    firstId: variablize(first + 'Id'),
    secondId: variablize(second + 'Id'),
    firstName: variablize(firstName),
    secondName: variablize(secondName),
  };
}
