import { Options, Schema } from '@mountnotion/types';
import i18n from 'i18next';
import { ensure } from './ensure.util';
import { Displayable, TypedDisplayConfiguration } from './types';

export function orderToOptions<TSchema extends Schema>({
  config,
}: {
  config: TypedDisplayConfiguration<TSchema>;
}) {
  return (acc: Options, { property: p }: Displayable) => {
    const property = ensure(p);
    const values = config.schema.options?.[property];
    if (!Array.isArray(values)) {
      return acc;
    }

    return {
      ...acc,
      [property]: values.map((option) =>
        i18n.t(`schema.${config.schema.title}.option.${property}.${option}`)
      ),
    };
  };
}
