import {
  DatabasePropertyConfigResponse,
  Relations,
  Schema,
} from '@mountnotion/types';
import { log } from '@mountnotion/utils';

export function createRelations(
  properties: Record<string, DatabasePropertyConfigResponse>,
  schema: Schema[]
) {
  const relations = Object.entries(properties).reduce(
    (acc, [property, value]) => {
      if (value.type === 'relation') {
        const scheme = schema.find((s) => s.id === value.relation.database_id);

        if (!scheme) {
          log.warn({
            action: 'warning',
            message: `${value.name} relates to a database that could not be found.`,
          });
          return acc;
        }
        return {
          ...acc,
          [property]: scheme.title,
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
