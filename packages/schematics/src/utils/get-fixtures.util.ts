import { flattenDatabaseResponse, notion } from '@mountnotion/sdk';
import { FixturesOptions } from '@mountnotion/types';
import { flip, log } from '@mountnotion/utils';

type FixturesResponse = {
  fixtures: any[];
  title: string;
};
/**
 *
 * @returns fixtures without characters that are unusable in code generation
 */
export default async function getFixtures(
  options: FixturesOptions
): Promise<FixturesResponse> {
  const database = await notion.databases.retrieve({
    database_id: options.pageId,
  });
  const schema = flattenDatabaseResponse(database);
  const useAll = options.all?.includes(schema.title);
  const query = useAll
    ? notion.databases.query<any>(
        {
          database_id: options.pageId,
        },
        { flattenResponse: true, resultsOnly: true, all: true }
      )
    : notion.databases.query<any>(
        {
          database_id: options.pageId,
          page_size: 1,
        },
        { flattenResponse: true, resultsOnly: true }
      );
  log.info({
    action: 'querying',
    message: useAll ? 'all fixtures' : 'one fixtures',
    page: { emoji: schema.icon, title: schema.title },
  });
  const [fixtures] = await query;

  const santitizedFixtures = fixtures.map((fixture) => {
    /**
     * fixtureOnlyWithFoundColumns is necessary for scenarios where a relation
     * exists that is not shared with the integration. that relation will not
     * be a column, therefore the fixture must not include it's reference in the
     * response
     */
    const fixtureOnlyWithFoundColumns = Object.entries(fixture).reduce(
      (acc, [column, value]) => {
        const hasColumn = schema.columns[column] ? true : false;

        if (hasColumn) {
          const mapping = flip(schema.mappings);
          const mappedColumn = mapping[column];
          return {
            ...acc,
            [mappedColumn]: value,
          };
        }
        return acc;
      },
      {} as Record<string, any>
    );

    return {
      id: fixture.id,
      icon: fixture.icon,
      cover: fixture.cover,
      ...fixtureOnlyWithFoundColumns,
    };
  });

  const response = {
    title: schema.title,
    fixtures: santitizedFixtures,
  };

  return response;
}
