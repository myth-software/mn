import { Cache } from '@mountnotion/types';
import i18n from 'i18next';
import { ensure } from './ensure.util';

import { Displayable, Fields, TypedDisplayConfiguration } from './types';

export function orderToFields<TCache extends Cache>({
  config,
}: {
  config: TypedDisplayConfiguration<TCache>;
}) {
  return (acc: Fields, { property: p }: Displayable) => {
    const property = ensure(p);
    return {
      ...acc,
      [property]: i18n.t(`caches.${config.cache.title}.column.${property}`),
    };
  };
}
