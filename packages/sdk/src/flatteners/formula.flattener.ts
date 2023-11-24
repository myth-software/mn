import { DateResponse } from '@mountnotion/types';
import { flattenDate } from './date.flattener';

export function flattenFormula(formula: {
  expression?: unknown;
  string?: string;
  number?: number;
  date?: DateResponse;
}) {
  if (formula?.expression) {
    return formula.expression;
  }
  if (Object.keys(formula).includes('string')) {
    return formula.string;
  }
  if (Number.isFinite(formula?.number)) {
    return formula.number;
  }

  if (formula?.date) {
    return flattenDate(formula.date);
  }

  throw new Error('formula could not be flattened');
}
