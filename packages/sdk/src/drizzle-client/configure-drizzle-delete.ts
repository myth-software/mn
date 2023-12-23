import { AdditionalProperties } from '@mountnotion/types';
import { eq } from 'drizzle-orm';
import { MountNotionClientDrizzleConfig } from './configure-drizzle.type';

export default function configureDrizzleDelete<
  TConfig extends MountNotionClientDrizzleConfig<TConfig['schema']>
>(config: TConfig, title: string, drizzleScheme: TConfig['schema'][string]) {
  const db = config.db;
  return async ({ id }: Pick<AdditionalProperties, 'id'>) => {
    const [response] = await db
      .delete(drizzleScheme)
      .where(eq(drizzleScheme.id, id))
      .returning();

    return response;
  };
}
