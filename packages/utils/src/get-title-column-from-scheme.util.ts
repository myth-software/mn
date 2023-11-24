import { Schema } from '@mountnotion/types';

export function getTitleColumnFromSchema(scheme: Schema) {
  const title = Object.entries(scheme.columns).reduce(
    (acc, [column, columnType]) => {
      if (columnType === 'title') {
        return acc + column;
      }
      return acc;
    },
    ''
  );

  return title;
}
