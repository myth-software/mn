import { Cache, Options } from '@mountnotion/types';
import i18n from 'i18next';
import { ensure } from './ensure.util';
import { Displayable, TypedDisplayConfiguration } from './types';

export function orderToOptions<TCache extends Cache>({
  config,
}: {
  config: TypedDisplayConfiguration<TCache>;
}) {
  return (acc: Options, { property: p }: Displayable) => {
    const property = ensure(p);
    const values = config.cache.options?.[property];
    if (!Array.isArray(values)) {
      return acc;
    }

    return {
      ...acc,
      [property]: values.map((option) =>
        i18n.t(`caches.${config.cache.title}.option.${property}.${option}`)
      ),
    };
  };
}
