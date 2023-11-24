import { DrizzleOptions, Schema } from '@mountnotion/types';
import { ensure, getJoinTable, normalizeArray } from '@mountnotion/utils';

type RelationMapping = {
  constName: string;
  tableName: string;
  firstId: string;
  secondId: string;
  firstName: string;
  secondName: string;
  firstValue?: string | string[];
  secondValue?: string | string[];
};

export function getRelations(
  schema: Schema[],
  options: DrizzleOptions
): {
  byId: { [id: string]: RelationMapping };
  allIds: string[];
} {
  const relationMappings: RelationMapping[] = schema
    .filter((schema) => schema.relations)
    .map((schema) => {
      const relations = ensure(schema.relations);

      return Object.entries(relations)
        .filter(([, relatedTable]) => !options.excludes.includes(relatedTable))
        .map(([relatedColumn]) => getJoinTable(relatedColumn, schema));
    })
    .flat();
  const pairings = normalizeArray(relationMappings, 'constName');
  return pairings;
}
