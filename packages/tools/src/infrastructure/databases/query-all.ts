import {
  QueryDatabaseParameters,
  QueryDatabaseResponse,
} from '@mountnotion/types';
import { queryResponse } from './query-response';

export const queryAll = async (
  input: QueryDatabaseParameters
): Promise<QueryDatabaseResponse[]> => {
  const response = await queryResponse(input);
  const responses = [response];

  if (response.has_more) {
    return responses.concat(
      await queryAll({
        ...input,
        start_cursor: response.next_cursor ?? undefined,
      })
    );
  } else {
    return responses;
  }
};
