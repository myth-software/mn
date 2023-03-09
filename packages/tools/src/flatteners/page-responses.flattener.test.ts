import { flattenPageResponses } from './page-responses.flattener';

describe('flatten page responses', () => {
  test('empty response', () => {
    const [entity, properties] = flattenPageResponses<unknown>([]);

    expect(entity).toMatchObject({});
    expect(properties).toMatchObject({});
  });
});
