import { eq, ilike, ne, notIlike } from 'drizzle-orm';
import { FilterArgs } from '../configure-drizzle.type';
import { existencePropertyFilter } from './existence.filter';

export function textPropertyFilter({ database, filter, property }: FilterArgs) {
  const existence = existencePropertyFilter({ database, filter, property });

  if (existence) {
    return existence;
  }

  if (filter.equals) {
    return { filter: eq(database[property], filter.equals) };
  }

  if (filter.does_not_equal) {
    return { filter: ne(database[property], filter.does_not_equal) };
  }

  if (filter.contains) {
    return { filter: ilike(database[property], `%${filter.contains}%`) };
  }

  if (filter.does_not_contain) {
    return {
      filter: notIlike(database[property], `%${filter.does_not_contain}%`),
    };
  }

  if (filter.starts_with) {
    return {
      filter: ilike(database[property], `${filter.starts_with}%`),
    };
  }

  if (filter.ends_with) {
    return {
      filter: ilike(database[property], `%${filter.ends_with}`),
    };
  }

  return;
}
