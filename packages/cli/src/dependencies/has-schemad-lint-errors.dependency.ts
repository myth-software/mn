export function hasSchemadLintErrors() {
  const schema: Array<any> = [];
  const databasesWithRowsFails = schema.filter(
    (database) => database.lintFails.rows.length > 0
  );
  const canFix = databasesWithRowsFails.length > 1;

  if (!canFix) {
    throw new Error('no rows to fix');
  }
}
