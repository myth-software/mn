import { AdditionalProperties } from '@mountnotion/types';
import { eq } from 'drizzle-orm';
import populateRelatedIds from './configure-drizzle-populate-related-ids';
import { MountNotionClientDrizzleConfig } from './configure-drizzle.type';

export default function configureDrizzleRetrieve<
  TConfig extends MountNotionClientDrizzleConfig<TConfig['schema']>
>(config: TConfig, title: string, drizzleScheme: TConfig['schema'][string]) {
  const db = config.db;

  return async function drizzleRetrieve({
    id,
  }: Pick<AdditionalProperties, 'id'>) {
    // validation

    // retrieve gets the id all the same
    const [primary] = await db
      .select()
      .from(drizzleScheme)
      .where(eq(drizzleScheme.id, id));

    // from the response get relations
    const response = await populateRelatedIds(primary, config, title);

    return response;
  };
}
