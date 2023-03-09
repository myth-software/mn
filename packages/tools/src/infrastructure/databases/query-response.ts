import { QueryDatabaseParameters } from '@mountnotion/types';
import client from '../client';

export const queryResponse = async (query: QueryDatabaseParameters) => {
  try {
    const response = await client().databases.query(query);

    return response;
  } catch (e) {
    console.error(e);
    throw e;
  }
};
