import { eq, ne } from 'drizzle-orm';
import { FilterArgs } from '../configure-drizzle.type';
import { existencePropertyFilter } from './existence.filter';

export function selectPropertyFilter({
  database,
  filter,
  property,
}: FilterArgs) {
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

  return;
}
