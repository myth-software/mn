import { MountNotionQueryParameters } from '@mountnotion/types';
import populateRelatedIds from './configure-drizzle-populate-related-ids';
import { MountNotionClientDrizzleConfig } from './configure-drizzle.type';
import { mapNotionToDrizzleWhere } from './notion-to-drizzle-where.mapper';

export default function configureDrizzleQuery<
  TConfig extends MountNotionClientDrizzleConfig<TConfig['schema']>
>(config: TConfig, title: string, drizzleScheme: TConfig['schema'][string]) {
  const db = config.db;

  return async function drizzleQuery(args: MountNotionQueryParameters<any>) {
    // the fundamental challenge is to query and filter, i believe relations only,
    // with the new many-to-many handling
    const where = typeof args === 'string' ? JSON.parse(args) : args;
    const { filter, orderBy, limit, offset } = mapNotionToDrizzleWhere(
      where,
      drizzleScheme,
      config,
      title
    );
    const query = db.select().from(drizzleScheme);

    if (filter) {
      query.where(filter);
    }

    if (orderBy) {
      query.orderBy(...orderBy);
    }

    if (limit) {
      query.limit(limit);
    }

    if (offset) {
      query.offset(offset);
    }

    const response = await query;

    const populates = response.map((obj) =>
      populateRelatedIds(obj, config, title)
    );
    const populated = await Promise.all(populates);

    return populated;
  };
}
