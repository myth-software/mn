import { eq, gt, gte, lt, lte } from 'drizzle-orm';
import { FilterArgs } from '../configure-drizzle.type';
import { existencePropertyFilter } from './existence.filter';

export function datePropertyFilter({ database, filter, property }: FilterArgs) {
  const existence = existencePropertyFilter({ database, filter, property });

  if (existence) {
    return existence;
  }

  if (filter.equals) {
    return eq(database[property], filter.equals);
  }

  if (filter.before) {
    return lt(database[property], filter.before);
  }

  if (filter.after) {
    return gt(database[property], filter.after);
  }

  if (filter.on_or_before) {
    return lte(database[property], filter.on_or_before);
  }

  if (filter.on_or_after) {
    return gte(database[property], filter.on_or_after);
  }

  if (filter.past_week) {
    throw new Error('past_week filter is unimplemented');
  }

  if (filter.past_month) {
    throw new Error('past_month filter is unimplemented');
  }

  if (filter.past_year) {
    throw new Error('past_year filter is unimplemented');
  }

  if (filter.next_week) {
    throw new Error('next_week filter is unimplemented');
  }

  if (filter.next_month) {
    throw new Error('next_month filter is unimplemented');
  }

  if (filter.next_year) {
    throw new Error('next_year filter is unimplemented');
  }

  throw new Error('uncaught date filter case');
}
