import { Columns, FlatDatabase, Options } from '@mountnotion/types';
import { Configuration, OpenAIApi } from 'openai';
export async function getTranslation(
  { columns, options }: FlatDatabase,
  lng: 'en' | 'es'
) {
  const columnNames = Object.keys(columns).reduce((acc, curr) => {
    return {
      ...acc,
      [curr]: curr,
    };
  }, {} as Record<string, string>);

  if (lng === 'en') {
    return {
      columns: columnNames,
      options,
    };
  }
  const language = lng === 'es' ? 'spanish' : 'english';

  const configuration = new Configuration({
    apiKey: process.env['OPENAI_API_KEY'],
  });
  const openai = new OpenAIApi(configuration);

  const translatedColumns = (
    await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Translate i18n locale json file to ${language} by translating only the values, not the keys.`,
        },
        {
          role: 'user',
          content: JSON.stringify(columnNames),
        },
      ],
    })
  ).data.choices[0].message?.content;

  const translatedOptions = options
    ? (
        await openai.createChatCompletion({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `Translate i18n locale json file to ${language} by translating only the values, not the keys.`,
            },
            {
              role: 'user',
              content: JSON.stringify(options),
            },
          ],
        })
      ).data.choices[0].message?.content
    : null;

  if (translatedColumns === undefined || translatedOptions === undefined) {
    throw new Error('error');
  }

  const response = {
    columns: JSON.parse(translatedColumns) as Columns,
    options:
      translatedOptions === null
        ? null
        : (JSON.parse(translatedOptions) as Options),
  };
  return response;
}
