import { QueryFilter, Schema } from '@mountnotion/types';

export function expandQueryToFilters(
  schema: Schema,
  query: any
): QueryFilter<any> {
  const filters: QueryFilter<any> = {
    and: [],
  };
  for (const key in query) {
    const value = query[key];
    const column = schema.mappings[key];
    const colType = schema.columns[column];
    if (!value) {
      continue;
    }
    if (colType === 'checkbox') {
      filters.and.push({
        property: key,
        checkbox: {
          equals: value,
        },
      });
    }
    if (colType === 'select') {
      filters.and.push({
        property: key,
        select: {
          equals: value,
        },
      });
    }
    if (colType === 'date') {
      filters.and.push({
        property: key,
        date: {
          equals: value,
        },
      });
    }
    if (colType === 'email') {
      filters.and.push({
        property: key,
        email: {
          contains: value,
        },
      });
    }
    if (colType === 'number') {
      filters.and.push({
        property: key,
        number: {
          equals: value,
        },
      });
    }

    if (colType === 'email') {
      filters.and.push({
        property: key,
        email: {
          contains: value,
        },
      });
    }

    if (colType === 'relation') {
      filters.and.push({
        property: key,
        relation: {
          contains: value,
        },
      });
    }

    if (colType === 'rich_text') {
      filters.and.push({
        property: key,
        rich_text: {
          contains: value,
        },
      });
    }

    if (colType === 'title') {
      filters.and.push({
        property: key,
        title: {
          contains: value,
        },
      });
    }

    if (colType === 'multi_select') {
      filters.and.push({
        property: key,
        multi_select: {
          contains: value,
        },
      });
    }

    if (colType === 'status') {
      filters.and.push({
        property: key,
        title: {
          equals: value,
        },
      });
    }

    if (colType === 'url') {
      filters.and.push({
        property: key,
        url: {
          contains: value,
        },
      });
    }
    if (colType === 'people') {
      continue;
    }

    if (colType === 'files') {
      continue;
    }
    if (colType === 'formula') {
      continue;
    }

    if (colType === 'rollup') {
      continue;
    }
    if (colType === 'phone_number') {
      continue;
    }
  }
  return filters;
}
