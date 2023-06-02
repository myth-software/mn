import { Mappings } from '@mountnotion/types';

export function queryMapper(query: any, mappings: Mappings) {
  const filterMapper = (filter: any) => ({
    ...filter,
    property: mappings[filter.property],
  });

  if (!query.filter) {
    return query;
  }

  if (!query.filter.or && !query.filter.and) {
    return {
      ...query,
      filter: filterMapper(query.filter),
    };
  }

  if (query.filter.or) {
    return {
      ...query,
      filter: {
        or: query.filter.or.map((orFilter: any) => filterMapper(orFilter)),
      },
    };
  }

  if (query.filter.and && query.filter.and[0].or) {
    return {
      ...query,
      filter: {
        and: [
          {
            or: query.filter.and[0].or.map((orFilter: any) =>
              filterMapper(orFilter)
            ),
          },
          filterMapper(query.filter.and[1]),
        ],
      },
    };
  }

  return {
    ...query,
  };
}
