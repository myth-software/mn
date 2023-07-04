import { inArray, notInArray } from 'drizzle-orm';
import { FilterArgs } from '../configure-drizzle.type';
import { existencePropertyFilter } from './existence.filter';

export function multiSelectPropertyFilter({
  database,
  filter,
  property,
}: FilterArgs) {
  const existence = existencePropertyFilter({ database, filter, property });

  if (existence) {
    return existence;
  }

  if (filter.contains) {
    return inArray(database[property], filter.contains);
  }

  if (filter.does_not_contain) {
    return notInArray(database[property], filter.does_not_contain);
  }

  throw new Error('uncaught multi_select filter case');
}
