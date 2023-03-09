export function flattenFormula(formula: {
  expression?: unknown;
  string?: string;
  number?: number;
}) {
  if (formula?.expression) {
    return formula.expression;
  }
  if (formula?.string) {
    return formula.string;
  }
  if (formula?.number) {
    return formula.number;
  }

  throw new Error('formula could not be flattened');
}
