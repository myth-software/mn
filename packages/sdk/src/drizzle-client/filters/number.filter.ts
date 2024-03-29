import { eq, gt, gte, lt, lte, ne } from 'drizzle-orm';
import { FilterArgs } from '../configure-drizzle.type';
import { existencePropertyFilter } from './existence.filter';

export function numberPropertyFilter({
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

  if (filter.greater_than) {
    return gt(database[property], filter.greater_than);
  }

  if (filter.less_than) {
    return lt(database[property], filter.less_than);
  }

  if (filter.greater_than_or_equal_to) {
    return gte(database[property], filter.greater_than_or_equal_to);
  }

  if (filter.less_than_or_equal_to) {
    return lte(database[property], filter.less_than_or_equal_to);
  }

  throw new Error('uncaught number filter case');
}
