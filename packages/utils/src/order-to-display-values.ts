import { Instance, Options, Schema } from '@mountnotion/types';
import { ensure } from './ensure.util';
import { DisplayConfiguration, Displayable, TypedValues } from './types';

export function orderToDisplayValues<TSchema extends Schema>({
  config,
  data,
  options,
}: {
  config: DisplayConfiguration;
  data?: Instance;
  options: Options;
}) {
  return (
    acc: TypedValues<TSchema>,
    { property: p, config: { defaultValue } = {} }: Displayable
  ) => {
    const property = ensure(p);
    const existingValue = data?.[property];

    if (
      (existingValue || defaultValue) &&
      config.schema.columns?.[property] === 'select'
    ) {
      const schemaOptions = ensure(config.schema.options)[property];
      const displayOptions = options?.[property];

      const optionIndex = schemaOptions.findIndex(
        (option) => option === existingValue || option === defaultValue
      );
      const option = displayOptions[optionIndex];

      return {
        ...acc,
        [property]: option,
      };
    }

    if (config.schema.columns?.[property] === 'checkbox') {
      const existingBoolean =
        typeof existingValue === 'boolean' ? existingValue : null;
      return {
        ...acc,
        [property]: existingBoolean ?? false,
      };
    }

    if (config.schema.columns?.[property] === 'date') {
      const existingDate =
        typeof existingValue === 'string' ? existingValue : null;
      return {
        ...acc,
        [property]: existingDate ?? '',
      };
    }

    if (config.schema.columns?.[property] === 'files') {
      const existingFiles = Array.isArray(existingValue) ? existingValue : null;
      return {
        ...acc,
        [property]: existingFiles ?? [],
      };
    }

    if (existingValue && config.schema.columns?.[property] === 'phone_number') {
      return {
        ...acc,
        [property]: existingValue,
      };
    }

    if (existingValue && config.schema.columns?.[property] === 'multi_select') {
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
