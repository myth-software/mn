import { flattenDatabaseResponse, notion } from '@mountnotion/sdk';
import { LocalsOptions } from '@mountnotion/types';
import { flip, log } from '@mountnotion/utils';

type LocalResponse = {
  locals: any[];
  title: string;
};
/**
 *
 * @returns locals without characters that are unusable in code generation
 */
export const getlocals = async (
  options: LocalsOptions
): Promise<LocalResponse> => {
  const database = await notion.databases.retrieve({
    database_id: options.pageId,
  });
  const flatDatabase = flattenDatabaseResponse(database, options);
  const useAll = options.all?.includes(flatDatabase.title);
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
    message: useAll ? 'all locals' : 'one locals',
    page: { emoji: flatDatabase.icon, title: flatDatabase.title },
  });
  const [locals] = await query;

  const santitizedLocals = locals.map((local) => {
    /**
     * localOnlyWithFoundColumns is necessary for scenarios where a relation
     * exists that is not shared with the integration. that relation will not
     * be a column, therefore the local must not include it's reference in the
     * response
     */
    const localOnlyWithFoundColumns = Object.entries(local).reduce(
      (acc, [column, value]) => {
        const hasColumn = flatDatabase.columns[column] ? true : false;

        if (hasColumn) {
          const mapping = flip(flatDatabase.mappings);
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
      id: local.id,
      icon: local.icon,
      cover: local.cover,
      ...localOnlyWithFoundColumns,
    };
  });

  const response = {
    title: flatDatabase.title,
    locals: santitizedLocals,
  };

  return response;
};
