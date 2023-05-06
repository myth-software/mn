import { ListBlockChildrenParameters } from '@mountnotion/types';
import client from '../../client';

export const list = async (query: ListBlockChildrenParameters) => {
  try {
    const response = await client().blocks.children.list(query);

    return response;
  } catch (e) {
    console.error(e);
    throw e;
  }
};
