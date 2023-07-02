import { eq, isNotNull, isNull, ne } from 'drizzle-orm';

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

    if (select.equals) {
      return { filter: eq(database[property], select.equals) };
    }

    if (select.does_not_equal) {
      return { filter: ne(database[property], select.does_not_equal) };
    }

    if (select.is_empty) {
      return { filter: isNull(database[property]) };
    }

    if (select.is_not_empty) {
      return { filter: isNotNull(database[property]) };
    }
  }

  return where;
}
