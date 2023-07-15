export function hasCachedLintErrors() {
  const cache: Array<any> = [];
  const databasesWithRowsFails = cache.filter(
    (database) => database.lintFails.rows.length > 0
  );
  const canFix = databasesWithRowsFails.length > 1;

  if (!canFix) {
    throw new Error('no rows to fix');
  }
}
