import { eq, ne } from 'drizzle-orm';
import { FilterArgs } from '../configure-drizzle.type';
import { existencePropertyFilter } from './existence.filter';

export function relationPropertyFilter({
  database,
  filter,
  property,
}: FilterArgs) {
  const existence = existencePropertyFilter({ database, filter, property });

  if (existence) {
    return existence;
  }

  if (filter.contains) {
    return eq(database[property], [filter.contains]);
  }

  if (filter.does_not_contain) {
    return ne(database[property], [filter.does_not_contain]);
  }

  throw new Error('uncaught relation filter case');
}
