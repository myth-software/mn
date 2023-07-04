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
    return eq(database[property], filter.equals);
  }

  if (filter.does_not_equal) {
    return ne(database[property], filter.does_not_equal);
  }

  throw new Error('uncaught select filter case');
}
