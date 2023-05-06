import { isFormulaGuard } from './is-formula.guard';

describe('formula', () => {
  test('is number', async () => {
    const isNumber = isFormulaGuard({
      id: 'xRjB',
      type: 'formula',
      formula: { type: 'number', number: 0 },
    });

    expect(isNumber).toBeTruthy();
  });
});
