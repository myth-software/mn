import { Cache } from '@mountnotion/types';

export function getTitleColumnFromCache(cache: Cache) {
  const title = Object.entries(cache.columns).reduce(
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
