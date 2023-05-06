import {
  PageObjectResponse,
  QueryDatabaseParameters,
} from '@mountnotion/types';
import { queryResponse } from './query-response';

export const queryAllResults = async (
  input: QueryDatabaseParameters
): Promise<PageObjectResponse[]> => {
  const databaseResponse = await queryResponse(input);
  const pageResponses = databaseResponse.results as PageObjectResponse[];
  if (databaseResponse.has_more) {
    const nextPageResponses = (await queryAllResults({
      ...input,
      start_cursor: databaseResponse.next_cursor ?? undefined,
    })) as PageObjectResponse[];

    return pageResponses.concat(nextPageResponses);
  } else {
    return pageResponses as PageObjectResponse[];
  }
};
