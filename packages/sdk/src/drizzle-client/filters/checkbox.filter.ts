import { eq, ne } from 'drizzle-orm';
import { FilterArgs } from '../configure-drizzle.type';

export function checkboxPropertyFilter({
  database,
  filter,
  property,
}: FilterArgs) {
  if (typeof filter.equals === 'boolean') {
    return eq(database[property], filter.equals);
  }

  if (typeof filter.does_not_equal === 'boolean') {
    return ne(database[property], filter.does_not_equal);
  }

  throw new Error('uncaught checkbox filter case');
}
