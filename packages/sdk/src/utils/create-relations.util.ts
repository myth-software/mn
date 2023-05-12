import { DatabasePropertyConfigResponse, Relations } from '@mountnotion/types';

export function createRelations(
  properties: Record<string, DatabasePropertyConfigResponse>
) {
  const relations = Object.entries(properties).reduce(
    (acc, [property, value]) => {
      if (value.type === 'relation') {
        return {
          ...acc,
          [property]: {
            database_id: value.relation.database_id,
            limit: value.relation.type === 'single_property' ? 'one' : 'none',
          },
        } as Relations;
      }

      return acc;
    },
    {} as Relations
  );

  if (Object.keys(relations).length === 0) {
    return null;
  }

  return relations;
}
