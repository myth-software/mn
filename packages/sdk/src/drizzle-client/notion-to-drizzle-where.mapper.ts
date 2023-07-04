import {
  checkboxPropertyFilter,
  datePropertyFilter,
  existencePropertyFilter,
  multiSelectPropertyFilter,
  numberPropertyFilter,
  peoplePropertyFilter,
  relationPropertyFilter,
  selectPropertyFilter,
  textPropertyFilter,
} from './filters';

export function notionToDrizzleWhereMapper(
  database: any,
  where: any
): {
  filter?: any;
  orderBy?: any;
} {
  if (!where) {
    return {};
  }

  if (where.filter.select) {
    const { select, property } = where.filter;
    const filter = selectPropertyFilter({ database, filter: select, property });
    if (filter) {
      return filter;
    }
  }

  if (where.filter.rich_text) {
    const { rich_text, property } = where.filter;
    const filter = textPropertyFilter({
      database,
      filter: rich_text,
      property,
    });
    if (filter) {
      return filter;
    }
  }

  if (where.filter.title) {
    const { title, property } = where.filter;
    const filter = textPropertyFilter({ database, filter: title, property });
    if (filter) {
      return filter;
    }
  }

  if (where.filter.phone_number) {
    const { phone_number, property } = where.filter;
    const filter = textPropertyFilter({
      database,
      filter: phone_number,
      property,
    });
    if (filter) {
      return filter;
    }
  }

  if (where.filter.url) {
    const { url, property } = where.filter;
    const filter = textPropertyFilter({ database, filter: url, property });
    if (filter) {
      return filter;
    }
  }

  if (where.filter.people) {
    const { people, property } = where.filter;
    const filter = peoplePropertyFilter({ database, filter: people, property });
    if (filter) {
      return filter;
    }
  }

  if (where.filter.date) {
    const { date, property } = where.filter;
    const filter = datePropertyFilter({ database, filter: date, property });
    if (filter) {
      return filter;
    }
  }

  if (where.filter.status) {
    const { status, property } = where.filter;
    const filter = selectPropertyFilter({ database, filter: status, property });
    if (filter) {
      return filter;
    }
  }

  if (where.filter.email) {
    const { email, property } = where.filter;
    const filter = textPropertyFilter({ database, filter: email, property });
    if (filter) {
      return filter;
    }
  }

  if (where.filter.multi_select) {
    const { multi_select, property } = where.filter;
    const filter = multiSelectPropertyFilter({
      database,
      filter: multi_select,
      property,
    });
    if (filter) {
      return filter;
    }
  }

  if (where.filter.relation) {
    const { relation, property } = where.filter;
    const filter = relationPropertyFilter({
      database,
      filter: relation,
      property,
    });
    if (filter) {
      return filter;
    }
  }

  if (where.filter.files) {
    const { files, property } = where.filter;
    const filter = existencePropertyFilter({
      database,
      filter: files,
      property,
    });
    if (filter) {
      return filter;
    }
  }

  if (where.filter.created_by) {
    const { created_by, property } = where.filter;
    const filter = peoplePropertyFilter({
      database,
      filter: created_by,
      property,
    });
    if (filter) {
      return filter;
    }
  }

  if (where.filter.created_time) {
    const { created_time, property } = where.filter;
    const filter = datePropertyFilter({
      database,
      filter: created_time,
      property,
    });
    if (filter) {
      return filter;
    }
  }

  if (where.filter.last_edited_by) {
    const { last_edited_by, property } = where.filter;
    const filter = peoplePropertyFilter({
      database,
      filter: last_edited_by,
      property,
    });
    if (filter) {
      return filter;
    }
  }

  if (where.filter.last_edited_time) {
    const { last_edited_time, property } = where.filter;
    const filter = datePropertyFilter({
      database,
      filter: last_edited_time,
      property,
    });
    if (filter) {
      return filter;
    }
  }

  if (where.filter.rollup) {
    throw new Error('rollup filter is unimplemented');
  }

  if (where.filter.formula) {
    throw new Error('formula filter is unimplemented');
  }

  if (where.filter.checkbox) {
    const { checkbox, property } = where.filter;
    const filter = checkboxPropertyFilter({
      database,
      filter: checkbox,
      property,
    });
    if (filter) {
      return filter;
    }
  }

  if (where.filter.number) {
    const { number, property } = where.filter;
    const filter = numberPropertyFilter({
      database,
      filter: number,
      property,
    });
    if (filter) {
      return filter;
    }
  }

  return where;
}
