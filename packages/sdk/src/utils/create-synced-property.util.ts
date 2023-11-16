import {
  DatabasePropertyConfigResponse,
  SyncedColumns,
} from '@mountnotion/types';

export function createSyncedColumns(
  properties: Record<string, DatabasePropertyConfigResponse>
) {
  const relations = Object.entries(properties).reduce(
    (acc, [property, value]) => {
      if (
        value.type === 'relation' &&
        value.relation.type === 'dual_property'
      ) {
        return {
          ...acc,
          [property]: value.relation.dual_property.synced_property_name,
        };
      }

      return acc;
    },
    {} as SyncedColumns
  );

  if (Object.keys(relations).length === 0) {
    return null;
  }

  return relations;
}
