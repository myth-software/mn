import { eq, ne } from 'drizzle-orm';
import { FilterArgs } from '../configure-drizzle.type';

export function checkboxPropertyFilter({
  database,
  filter,
  property,
}: FilterArgs) {
  if (filter.equals) {
    return eq(database[property], filter.equals);
  }

  if (filter.does_not_equal) {
    return ne(database[property], filter.does_not_equal);
  }

  throw new Error('uncaught checkbox filter case');
}
