import { SearchBodyParameters } from '@mountnotion/types';
import client from './client';

export const search = async (query: SearchBodyParameters) => {
  try {
    return await client().search(query);
  } catch (e) {
    console.error(e);
    throw e;
  }
};
