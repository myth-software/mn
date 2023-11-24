import { Infer, Mappings, Schema } from '@mountnotion/types';

export function mapInstance<TInstance extends Infer<Schema>>(
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
