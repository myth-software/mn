import { AppendBlockChildrenParameters } from '@mountnotion/types';
import client from '../../client';

export const append = async (query: AppendBlockChildrenParameters) => {
  try {
    const response = await client().blocks.children.append(query);

    return response;
  } catch (e) {
    console.error(e);
    throw e;
  }
};
