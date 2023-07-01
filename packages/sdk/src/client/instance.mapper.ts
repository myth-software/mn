import { Instance, Mappings } from '@mountnotion/types';

export function instanceMapper(
  instance: Instance,
  mappings: Mappings
): Instance {
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
    }
  );
}
