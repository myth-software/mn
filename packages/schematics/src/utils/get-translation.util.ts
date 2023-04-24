import { FlatDatabase } from '@mountnotion/types';
import { Configuration, OpenAIApi } from 'openai';
import { recursiveMap } from './recursive-map';
import { recursiveZip } from './recursive-zip';

export async function getTranslation(
  { columns, options }: FlatDatabase,
  lng: 'en' | 'es' | 'pt' | 'th'
) {
  const columnNames = Object.keys(columns).reduce((acc, curr) => {
    return {
      ...acc,
      [curr]: curr,
    };
  }, {} as Record<string, string>);

  const translatable = {
    columns: columnNames,
    options,
  };

  if (lng === 'en') {
    return translatable;
  }
  const language = lng === 'es' ? 'spanish' : 'english';
  const configuration = new Configuration({
    apiKey: process.env['OPENAI_API_KEY'],
  });
  const openai = new OpenAIApi(configuration);
  const translationInput = recursiveMap(translatable);
  const content = JSON.stringify(translationInput);
  const translationOutputString = (
    await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Translate all of the strings in the json to ${language}.`,
        },
        {
          role: 'user',
          content,
        },
      ],
    })
  ).data.choices[0].message?.content;

  if (translationOutputString === undefined) {
    throw new Error('error');
  }

  const translationOutput = JSON.parse(translationOutputString);
  const response = recursiveZip(translationInput, translationOutput);
  return response;
}
