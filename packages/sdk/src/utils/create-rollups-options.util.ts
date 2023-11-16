import {
  Cache,
  Columns,
  DatabasePropertyConfigResponse,
} from '@mountnotion/types';

export function createRollupsOptions(
  rollups: Columns,
  properties: Record<string, DatabasePropertyConfigResponse>,
  caches: Cache[]
): Cache['options'] {
  return Object.entries(rollups).reduce((acc, [property, type]) => {
    const dbProperty = properties[property];
    if (type !== 'select' && type !== 'multi_select' && type !== 'status') {
      return acc;
    }

    if (dbProperty.type !== 'rollup') {
      return acc;
    }

    const rollupName = dbProperty.rollup.rollup_property_name;
    const relationName = dbProperty.rollup.relation_property_name;
    const relationProperty = properties[relationName];

    if (relationProperty.type !== 'relation') {
      throw new Error('unexpectedly not a relation');
    }

    const relationDatabaseId = relationProperty.relation.database_id;
    const cache = caches.find((cache) => cache.id === relationDatabaseId);
    if (!cache) {
      throw new Error('relation database not found');
    }
    const { columns, options } = cache;

    if (
      (columns[rollupName] !== 'select' &&
        columns[rollupName] !== 'multi_select' &&
        columns[rollupName] !== 'status') ||
      !options
    ) {
      return acc;
    }

    return {
      ...acc,
      [property]: options[rollupName],
    };
  }, {} as Cache['options']);
}
