import { DeleteBlockParameters } from '@mountnotion/types';
import client from '../client';

export const del = async (input: DeleteBlockParameters) => {
  try {
    const response = await client().blocks.delete(input);

    return response;
  } catch (e) {
    console.error(e);
    throw e;
  }
};
