import { Cache, Instance, Options } from '@mountnotion/types';
import { ensure } from './ensure.util';
import { Displayable, DisplayConfiguration, TypedValues } from './types';

export function orderToDisplayValues<TCache extends Cache>({
  config,
  data,
  options,
}: {
  config: DisplayConfiguration;
  data?: Instance;
  options: Options;
}) {
  return (
    acc: TypedValues<TCache>,
    { property: p, config: { defaultValue } = {} }: Displayable
  ) => {
    const property = ensure(p);
    const existingValue = data?.[property];

    if (
      (existingValue || defaultValue) &&
      config.cache.columns?.[property] === 'select'
    ) {
      const cacheOptions = ensure(config.cache.options)[property];
      const displayOptions = options?.[property];

      const optionIndex = cacheOptions.findIndex(
        (option) => option === existingValue || option === defaultValue
      );
      const option = displayOptions[optionIndex];

      return {
        ...acc,
        [property]: option,
      };
    }

    if (config.cache.columns?.[property] === 'checkbox') {
      const existingBoolean =
        typeof existingValue === 'boolean' ? existingValue : null;
      return {
        ...acc,
        [property]: existingBoolean ?? false,
      };
    }

    if (config.cache.columns?.[property] === 'date') {
      const existingDate =
        typeof existingValue === 'string' ? existingValue : null;
      return {
        ...acc,
        [property]: existingDate ?? '',
      };
    }

    if (config.cache.columns?.[property] === 'files') {
      const existingFiles = Array.isArray(existingValue) ? existingValue : null;
      return {
        ...acc,
        [property]: existingFiles ?? [],
      };
    }

    if (existingValue && config.cache.columns?.[property] === 'phone_number') {
      return {
        ...acc,
        [property]: existingValue,
      };
    }

    if (existingValue && config.cache.columns?.[property] === 'multi_select') {
      return {
        ...acc,
        [property]: Array.isArray(existingValue)
          ? existingValue.join(', ')
          : '',
      };
    }

    if (typeof existingValue === 'number') {
      return {
        ...acc,
        [property]: existingValue,
      };
    }

    if (typeof existingValue === 'string') {
      return {
        ...acc,
        [property]: existingValue,
      };
    }

    return {
      ...acc,
      [property]: '',
    };
  };
}
