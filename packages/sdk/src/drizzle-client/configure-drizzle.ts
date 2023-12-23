import configureDrizzleCreate from './configure-drizzle-create';
import configureDrizzleDelete from './configure-drizzle-delete';
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
  const databases = Object.entries(config.schema).map(
    ([title, drizzleScheme]) => {
      return [
        title,
        {
          query: configureDrizzleQuery(config, title, drizzleScheme),
          retrieve: configureDrizzleRetrieve(config, title, drizzleScheme),
          update: configureDrizzleUpdate(config, title, drizzleScheme),
          create: configureDrizzleCreate(config, title, drizzleScheme),
          delete: configureDrizzleDelete(config, title, drizzleScheme),
        },
      ];
    }
  );

  return Object.fromEntries(databases);
}
