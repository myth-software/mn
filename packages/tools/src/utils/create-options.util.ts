import {
  DatabasePropertyConfigResponse,
  Options,
  SelectPropertyResponse,
} from '@mountnotion/types';

export function createOptions(
  properties: Record<string, DatabasePropertyConfigResponse>
) {
  const options = Object.entries(properties).reduce(
    (acc, [property, value]) => {
      const toOptionName = (option: SelectPropertyResponse) => option.name;
      if (value.type === 'select') {
        return {
          ...acc,
          [property]: value.select.options.map(toOptionName),
        };
      }

      if (value.type === 'multi_select') {
        return {
          ...acc,
          [property]: value.multi_select.options.map(toOptionName),
        };
      }

      if (value.type === 'status') {
        return {
          ...acc,
          [property]: value.status.options.map(toOptionName),
        };
      }
      return acc;
    },
    {} as Options
  );

  if (Object.keys(options).length === 0) {
    return null;
  }

  return options;
}
