import { ilike, notIlike } from 'drizzle-orm';
import { FilterArgs } from '../configure-drizzle.type';
import { existencePropertyFilter } from './existence.filter';

export function peoplePropertyFilter({
  database,
  filter,
  property,
}: FilterArgs) {
  const existence = existencePropertyFilter({ database, filter, property });

  if (existence) {
    return existence;
  }

  if (filter.contains) {
    return ilike(database[property], `%${filter.contains}%`);
  }

  if (filter.does_not_contain) {
    return notIlike(database[property], `%${filter.does_not_contain}%`);
  }

  throw new Error('uncaught people filter case');
}
