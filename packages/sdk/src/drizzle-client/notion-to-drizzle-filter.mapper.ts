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

export function mapNotionToDrizzleFilter(filter: any, database: any) {
  if (filter.select) {
    const { select, property } = filter;
    const drizzleFilter = selectPropertyFilter({
      database,
      filter: select,
      property,
    });

    if (drizzleFilter) {
      return drizzleFilter;
    }
  }

  if (filter.rich_text) {
    const { rich_text, property } = filter;
    const drizzleFilter = textPropertyFilter({
      database,
      filter: rich_text,
      property,
    });

    if (drizzleFilter) {
      return drizzleFilter;
    }
  }

  if (filter.title) {
    const { title, property } = filter;
    const drizzleFilter = textPropertyFilter({
      database,
      filter: title,
      property,
    });

    if (drizzleFilter) {
      return drizzleFilter;
    }
  }

  if (filter.phone_number) {
    const { phone_number, property } = filter;
    const drizzleFilter = textPropertyFilter({
      database,
      filter: phone_number,
      property,
    });

    if (drizzleFilter) {
      return drizzleFilter;
    }
  }

  if (filter.url) {
    const { url, property } = filter;
    const drizzleFilter = textPropertyFilter({
      database,
      filter: url,
      property,
    });

    if (drizzleFilter) {
      return drizzleFilter;
    }
  }

  if (filter.people) {
    const { people, property } = filter;
    const drizzleFilter = peoplePropertyFilter({
      database,
      filter: people,
      property,
    });

    if (drizzleFilter) {
      return drizzleFilter;
    }
  }

  if (filter.date) {
    const { date, property } = filter;
    const drizzleFilter = datePropertyFilter({
      database,
      filter: date,
      property,
    });

    if (drizzleFilter) {
      return drizzleFilter;
    }
  }

  if (filter.status) {
    const { status, property } = filter;
    const drizzleFilter = selectPropertyFilter({
      database,
      filter: status,
      property,
    });

    if (drizzleFilter) {
      return drizzleFilter;
    }
  }

  if (filter.email) {
    const { email, property } = filter;
    const drizzleFilter = textPropertyFilter({
      database,
      filter: email,
      property,
    });

    if (drizzleFilter) {
      return drizzleFilter;
    }
  }

  if (filter.multi_select) {
    const { multi_select, property } = filter;
    const drizzleFilter = multiSelectPropertyFilter({
      database,
      filter: multi_select,
      property,
    });

    if (drizzleFilter) {
      return drizzleFilter;
    }
  }

  if (filter.relation) {
    const { relation, property } = filter;
    const drizzleFilter = relationPropertyFilter({
      database,
      filter: relation,
      property,
    });

    if (drizzleFilter) {
      return drizzleFilter;
    }
  }

  if (filter.files) {
    const { files, property } = filter;
    const drizzleFilter = existencePropertyFilter({
      database,
      filter: files,
      property,
    });

    if (drizzleFilter) {
      return drizzleFilter;
    }
  }

  if (filter.created_by) {
    const { created_by, property } = filter;
    const drizzleFilter = peoplePropertyFilter({
      database,
      filter: created_by,
      property,
    });

    if (drizzleFilter) {
      return drizzleFilter;
    }
  }

  if (filter.created_time) {
    const { created_time, property } = filter;
    const drizzleFilter = datePropertyFilter({
      database,
      filter: created_time,
      property,
    });

    if (drizzleFilter) {
      return drizzleFilter;
    }
  }

  if (filter.last_edited_by) {
    const { last_edited_by, property } = filter;
    const drizzleFilter = peoplePropertyFilter({
      database,
      filter: last_edited_by,
      property,
    });

    if (drizzleFilter) {
      return drizzleFilter;
    }
  }

  if (filter.last_edited_time) {
    const { last_edited_time, property } = filter;
    const drizzleFilter = datePropertyFilter({
      database,
      filter: last_edited_time,
      property,
    });

    if (drizzleFilter) {
      return drizzleFilter;
    }
  }

  if (filter.rollup) {
    throw new Error('rollup filter is unimplemented');
  }

  if (filter.formula) {
    throw new Error('formula filter is unimplemented');
  }

  if (filter.checkbox) {
    const { checkbox, property } = filter;
    const drizzleFilter = checkboxPropertyFilter({
      database,
      filter: checkbox,
      property,
    });

    if (drizzleFilter) {
      return drizzleFilter;
    }
  }

  if (filter.number) {
    const { number, property } = filter;
    const drizzleFilter = numberPropertyFilter({
      database,
      filter: number,
      property,
    });

    if (drizzleFilter) {
      return drizzleFilter;
    }
  }

  throw new Error('unexpected missing filter case');
}
