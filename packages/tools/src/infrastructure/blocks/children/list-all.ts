import {
  ListBlockChildrenParameters,
  ListBlockChildrenResponse,
} from '@mountnotion/types';
import { list } from './list';

export const listAll = async (
  input: ListBlockChildrenParameters
): Promise<ListBlockChildrenResponse[]> => {
  const response = await list(input);
  const responses = [response];
  if (response.has_more) {
    return responses.concat(
      await listAll({
        ...input,
        start_cursor: response.next_cursor ?? undefined,
      })
    );
  } else {
    return responses;
  }
};
