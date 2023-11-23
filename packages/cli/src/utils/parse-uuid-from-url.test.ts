import parseUuidFromUrl from './parse-uuid-from-url';

describe('parseUuidFromUrl', () => {
  const expectedUuid = '4053d93a-7c66-40b0-bf69-6e048a5bd77a';
  test('should return the UUID from the URL without hyphens', () => {
    const url =
      'https://www.notion.so/mythsoftware/entities-4053d93a7c6640b0bf696e048a5bd77a?pvs=4';

    const result = parseUuidFromUrl(url);

    expect(result).toBe(expectedUuid);
  });

  test('should return the UUID from the URL with hyphens', () => {
    const url =
      'https://www.notion.so/mythsoftware/entities-4053d93a-7c66-40b0-bf69-6e048a5bd77a?pvs=4';

    const result = parseUuidFromUrl(url);

    expect(result).toBe(expectedUuid);
  });

  test('should return null if the URL does not contain a UUID', () => {
    const url = 'https://www.notion.so/mythsoftware/entities?pvs=4';

    const result = parseUuidFromUrl(url);

    expect(result).toBeNull();
  });
});
