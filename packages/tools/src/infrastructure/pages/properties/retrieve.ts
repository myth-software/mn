import { GetPagePropertyParameters } from '@mountnotion/types';
import client from '../../client';

export const retrieve = async (query: GetPagePropertyParameters) => {
  try {
    return await client().pages.properties.retrieve(query);
  } catch (e) {
    console.error(e);
    throw e;
  }
};
