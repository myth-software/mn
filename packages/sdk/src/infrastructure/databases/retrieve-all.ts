import { retrieveResponse } from './retrieve-response';

export const retrieveAll = async (ids: string[]) => {
  const promises = ids.map((database_id) => retrieveResponse({ database_id }));
  return Promise.all(promises);
};
