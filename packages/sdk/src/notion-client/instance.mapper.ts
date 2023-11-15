import { Cache, Infer, Mappings } from '@mountnotion/types';

export function mapInstance<TInstance extends Infer<Cache>>(
  instance: TInstance,
  mappings: Mappings
): TInstance {
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
    } as TInstance
  );
}
