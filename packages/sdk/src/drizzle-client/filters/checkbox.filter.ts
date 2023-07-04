import { eq, ne } from 'drizzle-orm';
import { FilterArgs } from '../configure-drizzle.type';

export function checkboxPropertyFilter({
  database,
  filter,
  property,
}: FilterArgs) {
  if (filter.equals) {
    return { filter: eq(database[property], filter.equals) };
  }

  if (filter.does_not_equal) {
    return { filter: ne(database[property], filter.does_not_equal) };
  }

  return;
}
