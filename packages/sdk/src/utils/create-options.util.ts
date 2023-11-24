import {
  DatabasePropertyConfigResponse,
  Options,
  SelectPropertyResponse,
} from '@mountnotion/types';
import { log } from '@mountnotion/utils';

export function createOptions(
  properties: Record<string, DatabasePropertyConfigResponse>,
  title: string
) {
  const options = Object.entries(properties).reduce(
    (acc, [property, value]) => {
      const toOptionName = (option: SelectPropertyResponse) => option.name;
      let propertyOptions: string[] = [];
      let hasOptions = false;

      if (value.type === 'select') {
        propertyOptions = value.select.options.map(toOptionName);
        hasOptions = true;
      }

      if (value.type === 'multi_select') {
        propertyOptions = value.multi_select.options.map(toOptionName);
        hasOptions = true;
      }

      if (value.type === 'status') {
        propertyOptions = value.status.options.map(toOptionName);
        hasOptions = true;
      }

      if (hasOptions && propertyOptions.length === 0) {
        log.fatal({
          action: 'failing',
          message: `notion database ${title} property ${property} must have at least 1 option.`,
        });
      }

      if (hasOptions) {
        return {
          ...acc,
          [property]: propertyOptions,
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
