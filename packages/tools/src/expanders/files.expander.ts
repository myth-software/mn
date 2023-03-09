export const expandFiles = (value: unknown) => {
  if (Array.isArray(value)) {
    return {
      files: value.map((url) => ({
        external: {
          url,
        },
        name: url.split('/').pop(),
        type: 'external',
      })),
    };
  }

  return { files: [] };
};
