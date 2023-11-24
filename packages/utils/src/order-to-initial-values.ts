import { Instance, Schema } from '@mountnotion/types';
import { ensure } from './ensure.util';
import { Displayable, TypedDisplayConfiguration, TypedValues } from './types';

export function orderToInitialValues<TSchema extends Schema>({
  config,
  data,
}: {
  config: TypedDisplayConfiguration<TSchema>;
  data?: Instance;
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
      const existingString =
        typeof existingValue === 'string' ? existingValue : null;
      const schemaOptions = ensure(config.schema.options)[property];
      const optionIndex = schemaOptions.findIndex(
        (option) => option === existingValue || option === defaultValue
      );
      const option = schemaOptions[optionIndex];

      return {
        ...acc,
        [property]: existingString ?? option ?? '',
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

    /**
     * files are excluded from initial values and are not
     * represented within the form as the other column types are
     */
    if (config.schema.columns?.[property] === 'files') {
      return acc;
    }

    if (config.schema.columns?.[property] === 'relation') {
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
