import {
  DatabaseObjectResponse,
  GetDatabaseParameters,
} from '@mountnotion/types';
import client from '../client';

export const retrieveResponse = async (query: GetDatabaseParameters) => {
  try {
    const response = (await client().databases.retrieve(
      query
    )) as DatabaseObjectResponse;

    return response;
  } catch (e) {
    console.error(e);
    throw e;
  }
};
