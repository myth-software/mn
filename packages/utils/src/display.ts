import { Entity, Options } from '@mountnotion/types';
import { ensure } from './ensure.util';
import { orderToDisplayValues } from './order-to-display-values';
import { orderToFields } from './order-to-fields';
import { orderToInitialValues } from './order-to-initial-values';
import { orderToOptions } from './order-to-options';
import {
  DisplayAction,
  displayActions,
  DisplayConfiguration,
  Fields,
  Instance,
  TypedDisplay,
  TypedDisplayConfiguration,
  TypedValues,
} from './types';

const i18n = {
  t: (a: string) => {
    return a;
  },
};
/**
 * the display function's purpose is to provide the single source of truth for
 * a display than can be relied on in all scenarios from lists to forms.
 *
 * display accepts a partially configured display that describes the
 * entity and properties to display as well as any overrides to the default
 * display configuration.
 * @param entity {@link Entity}
 * @param columns {@link Columns}
 * @returns display configuration {@link DisplayConfiguration}
 */
export function display<T extends Entity>(
  c: TypedDisplayConfiguration<T>
): (data?: Array<Instance> | Instance) => TypedDisplay<T, (typeof c)['limit']> {
  return (data) => {
    const limit = c.limit === 'one' ? 'one' : 'none';
    const config = c as DisplayConfiguration;
    const title = i18n.t(`displays.${config.id}`);

    const options = config?.order.reduce(
      orderToOptions<(typeof c)['entity']>({ config: c }),
      {} as Options
    );

    const fields = config?.order.reduce(
      orderToFields<(typeof c)['entity']>({ config: c }),
      {} as Fields
    );

    if (!Array.isArray(data)) {
      const initialValues = config?.order.reduce(
        orderToInitialValues<(typeof c)['entity']>({ config: c, data }),
        {} as TypedValues<T>
      );

      const displayValues = config?.order
        .filter(({ isHidden }) => !isHidden)
        .reduce(
          orderToDisplayValues<(typeof c)['entity']>({
            config: c,
            data,
            options,
          }),
          {} as TypedValues<T>
        );

      const hasData = config.order.some(({ property: p }) => {
        const property = ensure(p);
        const value = data?.[property];

        if (Array.isArray(value) && value.length === 0) {
          return false;
        }

        if (value === null || value === undefined) {
          return false;
        }

        return true;
      });

      const action: DisplayAction = hasData
        ? config.updateAction ?? 'edit'
        : config.addAction ?? 'add';

      const actions = displayActions.reduce((acc, action) => {
        return {
          ...acc,
          [action]: i18n.t(`header right.${action}`),
        };
      }, {} as Record<DisplayAction, string>);

      return Object.assign(c, {
        title,
        limit,
        hasData,
        options,
        fields,
        initialValues,
        displayValues,
        action,
        actions,
        instance: data,
      });
    }

    const initialValues = config?.order.reduce(
      orderToInitialValues<(typeof c)['entity']>({ config: c }),
      {} as TypedValues<T>
    );

    const displayValues = data?.map((d) =>
      config?.order
        .filter(({ isHidden }) => !isHidden)
        .reduce(
          orderToDisplayValues<(typeof c)['entity']>({
            config: c,
            data: d,
            options,
          }),
          {} as TypedValues<T>
        )
    )[0];

    const hasData = true;

    const action: DisplayAction = hasData
      ? config.updateAction ?? 'add'
      : config.addAction ?? 'add';

    const actions = displayActions.reduce((acc, action) => {
      return {
        ...acc,
        [action]: i18n.t(`header right.${action}`),
      };
    }, {} as Record<DisplayAction, string>);

    return Object.assign(c, {
      title,
      limit,
      hasData,
      options,
      fields,
      initialValues,
      displayValues,
      action,
      actions,
      instances: data,
    });
  };
}
