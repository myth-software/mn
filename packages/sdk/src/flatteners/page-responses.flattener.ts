import { Columns, PageObjectResponse } from '@mountnotion/types';
import { flattenPageResponse } from './page-response.flattener';

export function flattenPageResponses<TCache>(
  responses: PageObjectResponse[]
): [TCache[], Columns] {
  if (responses.length === 0) {
    return [[], {}];
  }

  const [, properties] = flattenPageResponse<TCache>(responses[0]);
  const caches = responses.map((response) => {
    const [cache] = flattenPageResponse<TCache>(response);
    return cache;
  });

  return [caches, properties];
}
