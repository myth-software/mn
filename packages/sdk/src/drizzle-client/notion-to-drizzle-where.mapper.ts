import { and, asc, desc, or } from 'drizzle-orm';
import { mapNotionToDrizzleFilter } from './notion-to-drizzle-filter.mapper';

type DrizzleWhere = {
  filter?: any;
  orderBy?: Array<any>;
};

type NotionWhere = {
  sorts?: Array<any>;
  filter?: any;
};

export function mapNotionToDrizzleWhere(
  database: any,
  where?: NotionWhere
): DrizzleWhere {
  const drizzleWhere = {} as DrizzleWhere;
  if (!where) {
    return drizzleWhere;
  }

  if (where.sorts) {
    drizzleWhere.orderBy = where.sorts.map((sort) => {
      if (sort.direction === 'ascending') {
        return asc(sort.property ?? sort.timestamp);
      }
      return desc(sort.property ?? sort.timestamp);
    });
  }

  if (!where.filter.or && !where.filter.and) {
    drizzleWhere.filter = mapNotionToDrizzleFilter(where.filter, database);
  }

  if (where.filter.or) {
    drizzleWhere.filter = or(
      ...where.filter.or.map((orFilter: any) =>
        mapNotionToDrizzleFilter(orFilter, database)
      )
    );
  }

  if (where.filter.and && where.filter.and.some((filter: any) => filter.or)) {
    const orIndex = where.filter.and.findIndex((filter: any) => filter.or);
    const otherIndex = where.filter.and.findIndex((filter: any) => !filter.or);

    drizzleWhere.filter = and(
      or(
        ...where.filter.and[orIndex].or.map((orFilter: any) =>
          mapNotionToDrizzleFilter(orFilter, database)
        )
      ),
      mapNotionToDrizzleFilter(where.filter.and[otherIndex], database)
    );
  }

  if (where.filter.and) {
    drizzleWhere.filter = and(
      ...where.filter.and.map((andFilter: any) =>
        mapNotionToDrizzleFilter(andFilter, database)
      )
    );
  }

  return drizzleWhere;
}
