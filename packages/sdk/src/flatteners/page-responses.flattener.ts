import { Columns, PageObjectResponse } from '@mountnotion/types';
import { flattenPageResponse } from './page-response.flattener';

export function flattenPageResponses<Entity>(
  responses: PageObjectResponse[]
): [Entity[], Columns] {
  if (responses.length === 0) {
    return [[], {}];
  }

  const [, properties] = flattenPageResponse<Entity>(responses[0]);
  const entities = responses.map((response) => {
    const [entity] = flattenPageResponse<Entity>(response);
    return entity;
  });

  return [entities, properties];
}
