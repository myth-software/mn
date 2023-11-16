import { Cache, DrizzleOptions } from '@mountnotion/types';
import {
  camelize,
  classify,
  decamelize,
  normalizeArray,
  sortTitleAndRelation,
  variablize,
} from '@mountnotion/utils';

type RelationMapping = {
  constName: string;
  tableName: string;
  firstId: string;
  secondId: string;
  firstName: string;
  secondName: string;
};

export function getRelations(
  caches: Cache[],
  options: DrizzleOptions
): {
  byId: { [id: string]: RelationMapping };
  allIds: string[];
} {
  const relationMappings: RelationMapping[] = caches
    .filter((cache) => cache.relations)
    .map((cache) => {
      if (!cache.relations) {
        throw new Error();
      }
      const baseTable = cache.title;

      return Object.entries(cache.relations)
        .filter(([, relatedTable]) => !options.excludes.includes(relatedTable))
        .map(([relatedColumn, relatedTable]) => {
          const syncedColumn = cache.syncedColumns?.[relatedColumn];
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
        });
    })
    .flat();
  const pairings = normalizeArray(relationMappings, 'constName');
  return pairings;
}
