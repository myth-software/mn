import {
  Cache,
  DatabasePropertyConfigResponse,
  Relations,
} from '@mountnotion/types';
import { log } from '@mountnotion/utils';

export function createRelations(
  properties: Record<string, DatabasePropertyConfigResponse>,
  caches: Cache[]
) {
  const relations = Object.entries(properties).reduce(
    (acc, [property, value]) => {
      if (value.type === 'relation') {
        const cache = caches.find((f) => f.id === value.relation.database_id);

        if (!cache) {
          log.warn({
            action: 'warning',
            message: `${value.name} relates to a database that could not be found.`,
          });
          return acc;
        }
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
