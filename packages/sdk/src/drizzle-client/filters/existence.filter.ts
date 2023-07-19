import { isNotNull, isNull } from 'drizzle-orm';
import { FilterArgs } from '../configure-drizzle.type';

export function existencePropertyFilter({
  database,
  filter,
  property,
}: FilterArgs) {
  if (filter.is_empty) {
    return isNull(database[property]);
  }

  if (filter.is_not_empty) {
    return isNotNull(database[property]);
  }

  return;
}
