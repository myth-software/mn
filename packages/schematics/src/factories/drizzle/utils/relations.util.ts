import { DrizzleOptions, FlatDatabase } from '@mountnotion/types';
import { camelize, classify, normalizeArray } from '@mountnotion/utils';

type RelationMapping = {
  constName: string;
  tableName: string;
  firstId: string;
  secondId: string;
  firstName: string;
  secondName: string;
};

export function getRelations(
  caches: FlatDatabase[],
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
      const baseTitle = cache.title;
      return Object.values(cache.relations)
        .filter((relation) => !options.excludes.includes(relation))
        .map((relation) => {
          const first =
            baseTitle.localeCompare(relation) < 0 ? baseTitle : relation;
          const second = first === baseTitle ? relation : baseTitle;
          return {
            constName: camelize(first) + classify(second),
            tableName: [first, second].join(' '),
            firstId: camelize(first + 'Id'),
            secondId: camelize(second + 'Id'),
            firstName: camelize(first),
            secondName: camelize(second),
          };
        });
    })
    .flat();
  const pairings = normalizeArray(relationMappings, 'constName');
  return pairings;
}
