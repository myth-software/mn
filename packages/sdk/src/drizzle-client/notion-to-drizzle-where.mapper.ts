import {
  datePropertyFilter,
  peoplePropertyFilter,
  selectPropertyFilter,
  textPropertyFilter,
} from './filters';

export function notionToDrizzleWhereMapper(
  database: any,
  where: any
): {
  filter?: any;
  orderBy?: any;
} {
  if (!where) {
    return {};
  }

  if (where.filter.select) {
    const { select, property } = where.filter;
    const filter = selectPropertyFilter({ database, filter: select, property });
    if (filter) {
      return filter;
    }
  }

  if (where.filter.rich_text) {
    const { rich_text, property } = where.filter;
    const filter = textPropertyFilter({
      database,
      filter: rich_text,
      property,
    });
    if (filter) {
      return filter;
    }
  }

  if (where.filter.title) {
    const { title, property } = where.filter;
    const filter = textPropertyFilter({ database, filter: title, property });
    if (filter) {
      return filter;
    }
  }

  if (where.filter.phone_number) {
    const { phone_number, property } = where.filter;
    const filter = textPropertyFilter({
      database,
      filter: phone_number,
      property,
    });
    if (filter) {
      return filter;
    }
  }

  if (where.filter.url) {
    const { url, property } = where.filter;
    const filter = textPropertyFilter({ database, filter: url, property });
    if (filter) {
      return filter;
    }
  }

  if (where.filter.people) {
    const { people, property } = where.filter;
    const filter = peoplePropertyFilter({ database, filter: people, property });
    if (filter) {
      return filter;
    }
  }

  if (where.filter.date) {
    const { date, property } = where.filter;
    const filter = datePropertyFilter({ database, filter: date, property });
    if (filter) {
      return filter;
    }
  }

  return where;
}
