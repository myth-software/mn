import { AdditionalProperties } from '@mountnotion/types';
import { eq } from 'drizzle-orm';
import configureDrizzleCreate from './configure-drizzle-create';
import configureDrizzleQuery from './configure-drizzle-query';
import configureDrizzleRetrieve from './configure-drizzle-retrieve';
import configureDrizzleUpdate from './configure-drizzle-update';
import {
  MountNotionClientDrizzleConfig,
  MountNotionDrizzleClient,
} from './configure-drizzle.type';

export function configureDrizzle<
  TConfig extends MountNotionClientDrizzleConfig<TConfig['schema']>
>(config: TConfig): MountNotionDrizzleClient<TConfig> {
  const db = config.db;

  const databases = Object.entries(config.schema).map(
    ([title, drizzleScheme]) => {
      return [
        title,
        {
          query: configureDrizzleQuery(config, title, drizzleScheme),
          retrieve: configureDrizzleRetrieve(config, title, drizzleScheme),
          update: configureDrizzleUpdate(config, title, drizzleScheme),
          create: configureDrizzleCreate(config, title, drizzleScheme),
          delete: async ({ id }: Pick<AdditionalProperties, 'id'>) => {
            const [response] = await db
              .delete(drizzleScheme)
              .where(eq(drizzleScheme.id, id))
              .returning();

            return response;
          },
        },
      ];
    }
  );

  return Object.fromEntries(databases);
}
