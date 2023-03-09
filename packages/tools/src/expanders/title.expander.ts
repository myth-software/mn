export const expandTitle = (value: unknown) => {
  if (value) {
    return {
      title: [
        {
          text: {
            content: value,
          },
        },
      ],
    };
  }

  return { title: [] };
};
