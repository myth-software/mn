import { Entity, Options } from '@mountnotion/types';
import i18n from 'i18next';
import { ensure } from './ensure.util';
import { Displayable, TypedDisplayConfiguration } from './types';

export function orderToOptions<T extends Entity>({
  config,
}: {
  config: TypedDisplayConfiguration<T>;
}) {
  return (acc: Options, { property: p }: Displayable) => {
    const property = ensure(p);
    const values = config.entity.options?.[property];
    if (!Array.isArray(values)) {
      return acc;
    }

    return {
      ...acc,
      [property]: values.map((option) =>
        i18n.t(`entities.${config.entity.title}.option.${property}.${option}`)
      ),
    };
  };
}
