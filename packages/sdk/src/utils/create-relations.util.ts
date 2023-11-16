import {
  Cache,
  DatabasePropertyConfigResponse,
  Relations,
} from '@mountnotion/types';
import { ensure } from '@mountnotion/utils';

export function createRelations(
  properties: Record<string, DatabasePropertyConfigResponse>,
  caches: Cache[]
) {
  const relations = Object.entries(properties).reduce(
    (acc, [property, value]) => {
      if (value.type === 'relation') {
        const cache = ensure(
          caches.find((f) => f.id === value.relation.database_id)
        );
        return {
          ...acc,
          [property]: cache.title,
        };
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
