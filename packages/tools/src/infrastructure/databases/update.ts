import {
  UpdateDatabaseParameters,
  UpdateDatabaseResponse,
} from '@mountnotion/types';
import client from '../client';

export const update = async (query: UpdateDatabaseParameters) => {
  try {
    const response = (await client().databases.update(
      query
    )) as UpdateDatabaseResponse;

    return response;
  } catch (e) {
    console.error(e);
    throw e;
  }
};
