import { AndFilter, OrFilter, Schema } from '@mountnotion/types';
import { and, asc, desc, or } from 'drizzle-orm';
import { MountNotionClientDrizzleConfig } from './configure-drizzle.type';
import { mapNotionToDrizzleFilter } from './notion-to-drizzle-filter.mapper';

type DrizzleWhere = {
  filter?: any;
  orderBy?: Array<any>;
  offset?: number;
  limit?: number;
};

type NotionWhere = {
  sorts?: Array<any>;
  filter?: any;
  start_cursor?: string | number;
  page_size?: number;
};

export function mapNotionToDrizzleWhere<
  TConfig extends MountNotionClientDrizzleConfig<TConfig['schema']>
>(
  where: NotionWhere,
  drizzleScheme: any,
  config: TConfig,
  title: string
): DrizzleWhere {
  const drizzleWhere = {} as DrizzleWhere;
  if (!where) {
    return drizzleWhere;
  }

  if (where.page_size) {
    drizzleWhere.limit = where.page_size;
  }

  if (where.start_cursor) {
    drizzleWhere.offset =
      typeof where.start_cursor === 'number'
        ? where.start_cursor
        : +where.start_cursor;
  }

  if (where.sorts) {
    drizzleWhere.orderBy = where.sorts.map((sort) => {
      if (sort.direction === 'ascending') {
        return asc(sort.property ?? sort.timestamp);
      }
      return desc(sort.property ?? sort.timestamp);
    });
  }
  if (!where.filter) {
    return drizzleWhere;
  }
  if (!where.filter.or && !where.filter.and) {
    drizzleWhere.filter = mapNotionToDrizzleFilter(
      where.filter,
      drizzleScheme,
      config,
      title
    );
  }

  if (where.filter.or) {
    drizzleWhere.filter = or(
      ...where.filter.or.map((orFilter: OrFilter<Schema>) =>
        mapNotionToDrizzleFilter(orFilter, drizzleScheme, config, title)
      )
    );
  }

  if (
    where.filter.and &&
    where.filter.and.some((filter: OrFilter<Schema>) => filter.or)
  ) {
    const orIndex = where.filter.and.findIndex(
      (filter: OrFilter<Schema>) => filter.or
    );
    const otherIndex = where.filter.and.findIndex(
      (filter: OrFilter<Schema>) => !filter.or
    );

    drizzleWhere.filter = and(
      or(
        ...where.filter.and[orIndex].or.map((orFilter: OrFilter<Schema>) =>
          mapNotionToDrizzleFilter(orFilter, drizzleScheme, config, title)
        )
      ),
      mapNotionToDrizzleFilter(
        where.filter.and[otherIndex],
        drizzleScheme,
        config,
        title
      )
    );
  }

  if (where.filter.and) {
    drizzleWhere.filter = and(
      ...where.filter.and.map((andFilter: AndFilter<Schema>) =>
        mapNotionToDrizzleFilter(andFilter, drizzleScheme, config, title)
      )
    );
  }

  return drizzleWhere;
}
