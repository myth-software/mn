import { Cache, Instance } from '@mountnotion/types';
import { ensure } from './ensure.util';
import { Displayable, TypedDisplayConfiguration, TypedValues } from './types';

export function orderToInitialValues<TCache extends Cache>({
  config,
  data,
}: {
  config: TypedDisplayConfiguration<TCache>;
  data?: Instance;
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
      const existingString =
        typeof existingValue === 'string' ? existingValue : null;
      const cacheOptions = ensure(config.cache.options)[property];
      const optionIndex = cacheOptions.findIndex(
        (option) => option === existingValue || option === defaultValue
      );
      const option = cacheOptions[optionIndex];

      return {
        ...acc,
        [property]: existingString ?? option ?? '',
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

    /**
     * files are excluded from initial values and are not
     * represented within the form as the other column types are
     */
    if (config.cache.columns?.[property] === 'files') {
      return acc;
    }

    if (config.cache.columns?.[property] === 'relation') {
      const existingRelation =
        typeof existingValue?.[0] === 'string' ? existingValue[0] : null;
      return {
        ...acc,
        [property]: existingRelation ?? '',
      };
    }

    if (typeof existingValue === 'string') {
      return {
        ...acc,
        [property]: existingValue,
      };
    }

    if (typeof existingValue === 'number') {
      return {
        ...acc,
        [property]: existingValue.toString(),
      };
    }

    return {
      ...acc,
      [property]: '',
    };
  };
}
