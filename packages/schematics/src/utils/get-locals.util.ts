import { flattenDatabaseResponse, notion } from '@mountnotion/tools';
import { LocalsOptions } from '@mountnotion/types';
import { santitizeTitle } from './sanitize-title.util';

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

  const useAll = options.all?.includes(flattenDatabaseResponse(database).title);
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

  const [locals] = await query;

  const santitizedLocals = locals.map((entity) => ({
    ...entity,
    title: santitizeTitle(entity.name),
  }));

  const response = {
    title: (database as any).title[0].plain_text,
    locals: santitizedLocals,
  };

  return response;
};
