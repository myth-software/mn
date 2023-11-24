import { Columns, PageObjectResponse } from '@mountnotion/types';
import { flattenPageResponse } from './page-response.flattener';

export function flattenPageResponses<TSchema>(
  responses: PageObjectResponse[]
): [TSchema[], Columns] {
  if (responses.length === 0) {
    return [[], {}];
  }

  const [, properties] = flattenPageResponse<TSchema>(responses[0]);
  const schema = responses.map((response) => {
    const [schema] = flattenPageResponse<TSchema>(response);
    return schema;
  });

  return [schema, properties];
}
