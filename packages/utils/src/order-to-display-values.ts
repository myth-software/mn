import { Entity, Options } from '@mountnotion/types';
import { ensure } from './ensure.util';
import {
  Displayable,
  DisplayConfiguration,
  Instance,
  TypedValues,
} from './types';

export function orderToDisplayValues<T extends Entity>({
  config,
  data,
  options,
}: {
  config: DisplayConfiguration;
  data?: Instance;
  options: Options;
}) {
  return (
    acc: TypedValues<T>,
    { property: p, config: { defaultValue } = {} }: Displayable
  ) => {
    const property = ensure(p);
    const existingValue = data?.[property];

    if (
      (existingValue || defaultValue) &&
      config.entity.columns?.[property] === 'select'
    ) {
      const entityOptions = ensure(config.entity.options)[property];
      const displayOptions = options?.[property];

      const optionIndex = entityOptions.findIndex(
        (option) => option === existingValue || option === defaultValue
      );
      const option = displayOptions[optionIndex];

      return {
        ...acc,
        [property]: option,
      };
    }

    if (config.entity.columns?.[property] === 'checkbox') {
      const existingBoolean =
        typeof existingValue === 'boolean' ? existingValue : null;
      return {
        ...acc,
        [property]: existingBoolean ?? false,
      };
    }

    if (config.entity.columns?.[property] === 'date') {
      const existingDate =
        typeof existingValue === 'string' ? existingValue : null;
      return {
        ...acc,
        [property]: existingDate ?? '',
      };
    }

    if (config.entity.columns?.[property] === 'files') {
      const existingFiles = Array.isArray(existingValue) ? existingValue : null;
      return {
        ...acc,
        [property]: existingFiles ?? [],
      };
    }

    if (existingValue && config.entity.columns?.[property] === 'phone_number') {
      return {
        ...acc,
        [property]: existingValue,
      };
    }

    if (existingValue && config.entity.columns?.[property] === 'multi_select') {
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
