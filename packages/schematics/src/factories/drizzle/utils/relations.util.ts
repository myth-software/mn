import { Cache, DrizzleOptions } from '@mountnotion/types';
import { ensure, getJoinTable, normalizeArray } from '@mountnotion/utils';

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
      const relations = ensure(cache.relations);

      return Object.entries(relations)
        .filter(([, relatedTable]) => !options.excludes.includes(relatedTable))
        .map(([relatedColumn]) => getJoinTable(relatedColumn, cache));
    })
    .flat();
  const pairings = normalizeArray(relationMappings, 'constName');
  return pairings;
}
