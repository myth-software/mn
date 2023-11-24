import { Schema } from '@mountnotion/types';
import i18n from 'i18next';
import { ensure } from './ensure.util';

import { Displayable, Fields, TypedDisplayConfiguration } from './types';

export function orderToFields<TSchema extends Schema>({
  config,
}: {
  config: TypedDisplayConfiguration<TSchema>;
}) {
  return (acc: Fields, { property: p }: Displayable) => {
    const property = ensure(p);
    return {
      ...acc,
      [property]: i18n.t(`schema.${config.schema.title}.column.${property}`),
    };
  };
}
