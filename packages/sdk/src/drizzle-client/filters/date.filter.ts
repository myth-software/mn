import { eq, gt, gte, lt, lte } from 'drizzle-orm';
import { FilterArgs } from '../configure-drizzle.type';
import { existencePropertyFilter } from './existence.filter';

export function datePropertyFilter({ database, filter, property }: FilterArgs) {
  const existence = existencePropertyFilter({ database, filter, property });

  if (existence) {
    return existence;
  }

  if (filter.equals) {
    return { filter: eq(database[property], filter.equals) };
  }

  if (filter.before) {
    return { filter: lt(database[property], filter.before) };
  }

  if (filter.after) {
    return { filter: gt(database[property], filter.after) };
  }

  if (filter.on_or_before) {
    return { filter: lte(database[property], filter.on_or_before) };
  }

  if (filter.on_or_after) {
    return { filter: gte(database[property], filter.on_or_after) };
  }

  if (filter.past_week) {
    return { filter: gte(database[property], filter.past_week) };
  }

  if (filter.past_month) {
    return { filter: gte(database[property], filter.past_month) };
  }

  if (filter.past_year) {
    return { filter: gte(database[property], filter.past_year) };
  }

  if (filter.next_week) {
    return { filter: gte(database[property], filter.next_week) };
  }

  if (filter.next_month) {
    return { filter: gte(database[property], filter.next_month) };
  }

  if (filter.next_year) {
    return { filter: gte(database[property], filter.next_year) };
  }

  return;
}
