import { Entity, Infer, Mappings } from '@mountnotion/types';

export function mapInstance<T extends Infer<Entity>>(
  instance: T,
  mappings: Mappings
): T {
  return Object.entries(mappings).reduce(
    (acc, [mappedName, columnName]) => {
      return {
        ...acc,
        [mappedName]: instance[columnName],
      };
    },
    {
      id: instance.id,
      cover: instance.cover,
      icon: instance.icon,
    } as T
  );
}
