export const expandRichText = (value: unknown) => {
  if (value !== null) {
    return {
      rich_text: [
        {
          type: 'text',
          text: {
            content: value,
          },
        },
      ],
    };
  }

  return { rich_text: [] };
};
