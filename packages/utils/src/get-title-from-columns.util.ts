import { Entity } from '@mountnotion/types';

export function getTitleColumnFromEntity(entity: Entity) {
  const title = Object.entries(entity.columns).reduce(
    (acc, [column, columnType]) => {
      if (columnType === 'title') {
        return acc + column;
      }
      return acc;
    },
    ''
  );

  return title;
}
