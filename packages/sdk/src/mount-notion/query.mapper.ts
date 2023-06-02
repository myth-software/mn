import { Mappings } from '@mountnotion/types';

export function queryMapper(query: any, mappings: Mappings) {
  if (!query.filter) {
    return query;
  }
  const filterKeys = Object.keys(query.filter);
  if (!filterKeys.some((key) => key === 'and' || key === 'or')) {
    return {
      ...query,
      filter: {
        ...query.filter,
        property: mappings[query.filter.property],
      },
    };
  }

  if (query.filter.or) {
    return {
      ...query,
      filter: {
        or: query.filter.or.map((orFilter: any) => ({
          ...orFilter,
          property: mappings[orFilter.property],
        })),
      },
    };
  }
  if (query.filter.and) {
    return {
      ...query,
      filter: {
        and: [
          {
            ...query.filter.and[0],
            filter: {
              ...query.filter,
              property: mappings[query.filter.property],
            },
          },
        ],
      },
    };
  }

  return {
    ...query,
  };
}
