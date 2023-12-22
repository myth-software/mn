import {
  Filter,
  MajorAndFilter,
  QueryFilter,
  Schema,
} from '@mountnotion/types';

export function expandQueryToFilters(
  schema: Schema,
  query: any
): QueryFilter<any> | null {
  const queryKeys = Object.keys(query);
  const queryCount = queryKeys.length;
  if (queryCount === 0) {
    return null;
  }

  if (queryCount === 1) {
    const key = queryKeys[0];
    const value = query[key];
    const column = schema.mappings[key];
    const colType = schema.columns[column];
    return getFilter(colType, key, value);
  }

  const filters = {
    and: [],
  } as MajorAndFilter<any>;
  for (const key of queryKeys) {
    const value = query[key];
    const column = schema.mappings[key];
    const colType = schema.columns[column];
    if (!value) {
      continue;
    }
    const filter = getFilter(colType, key, value);

    filters.and.push(filter);
  }
  return filters;
}

function getFilter(
  colType: string,
  key: string,
  value: string | boolean | number
): Filter<any> {
  if (colType === 'checkbox' && typeof value === 'boolean') {
    return {
      property: key,
      checkbox: {
        equals: value,
      },
    };
  }
  if (colType === 'select') {
    return {
      property: key,
      select: {
        equals: value,
      },
    };
  }
  if (colType === 'date' && typeof value === 'string') {
    return {
      property: key,
      date: {
        equals: value,
      },
    };
  }
  if (colType === 'email' && typeof value === 'string') {
    return {
      property: key,
      email: {
        contains: value,
      },
    };
  }
  if (colType === 'number' && typeof value === 'number') {
    return {
      property: key,
      number: {
        equals: value,
      },
    };
  }

  if (colType === 'relation' && typeof value === 'string') {
    return {
      property: key,
      relation: {
        contains: value,
      },
    };
  }
  if (colType === 'rich_text' && typeof value === 'string') {
    return {
      property: key,
      rich_text: {
        contains: value,
      },
    };
  }
  if (colType === 'title' && typeof value === 'string') {
    return {
      property: key,
      title: {
        contains: value,
      },
    };
  }
  if (colType === 'multi_select' && typeof value === 'string') {
    return {
      property: key,
      multi_select: {
        contains: value,
      },
    };
  }
  if (colType === 'status' && typeof value === 'string') {
    return {
      property: key,
      title: {
        equals: value,
      },
    };
  }
  if (colType === 'url' && typeof value === 'string') {
    return {
      property: key,
      url: {
        contains: value,
      },
    };
  }
  if (colType === 'people' && typeof value === 'string') {
    return {
      property: key,
      people: {
        contains: value,
      },
    };
  }
  if (colType === 'files' && value === true) {
    return {
      property: key,
      people: {
        is_not_empty: value,
      },
    };
  }
  if (colType === 'phone_number' && typeof value === 'string') {
    return {
      property: key,
      phone_number: {
        contains: value,
      },
    };
  }

  const errorMessage = `expandQueryToFilters could not find colType/value match for colType ${colType} and value ${value}`;

  if (colType === 'formula') {
    throw new Error(errorMessage);
  }
  if (colType === 'rollup') {
    throw new Error(errorMessage);
  }
  throw new Error(errorMessage);
}
