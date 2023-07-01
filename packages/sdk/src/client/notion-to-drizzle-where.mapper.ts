import { eq, isNotNull, isNull, ne } from 'drizzle-orm';

export function notionToDrizzleWhereMapper(database: any, where: any) {
  if (where.filter.select) {
    const { select, property } = where.filter;

    if (select.equals) {
      return eq(database[property], select.equals);
    }

    if (select.does_not_equal) {
      return ne(database[property], select.does_not_equal);
    }

    if (select.is_empty) {
      return isNull(database[property]);
    }

    if (select.is_not_empty) {
      return isNotNull(database[property]);
    }
  }

  return where;
}
