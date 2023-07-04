import { eq, ilike, ne, notIlike } from 'drizzle-orm';
import { FilterArgs } from '../configure-drizzle.type';
import { existencePropertyFilter } from './existence.filter';

export function textPropertyFilter({ database, filter, property }: FilterArgs) {
  const existence = existencePropertyFilter({ database, filter, property });

  if (existence) {
    return existence;
  }

  if (filter.equals) {
    return eq(database[property], filter.equals);
  }

  if (filter.does_not_equal) {
    return ne(database[property], filter.does_not_equal);
  }

  if (filter.contains) {
    return ilike(database[property], `%${filter.contains}%`);
  }

  if (filter.does_not_contain) {
    return notIlike(database[property], `%${filter.does_not_contain}%`);
  }

  if (filter.starts_with) {
    return ilike(database[property], `${filter.starts_with}%`);
  }

  if (filter.ends_with) {
    return ilike(database[property], `%${filter.ends_with}`);
  }

  throw new Error('uncaught text filter case');
}
