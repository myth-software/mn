import { Entity } from '@mountnotion/types';
import i18n from 'i18next';
import { ensure } from './ensure.util';

import { Displayable, Fields, TypedDisplayConfiguration } from './types';

export function orderToFields<T extends Entity>({
  config,
}: {
  config: TypedDisplayConfiguration<T>;
}) {
  return (acc: Fields, { property: p }: Displayable) => {
    const property = ensure(p);
    return {
      ...acc,
      [property]: i18n.t(`entities.${config.entity.title}.column.${property}`),
    };
  };
}
