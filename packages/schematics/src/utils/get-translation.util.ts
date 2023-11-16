import { TranslationServiceClient } from '@google-cloud/translate';
import { Cache } from '@mountnotion/types';
import { ensure } from '@mountnotion/utils';
import { Configuration, OpenAIApi } from 'openai';
import { recursiveMap } from './recursive-map';
import { recursiveZip } from './recursive-zip';

// Instantiates a client
const translationClient = new TranslationServiceClient();

const projectId = 'mountnotion';
const location = 'global';
const text = 'Hello, world!';

export async function getTranslation(
  { columns, options }: Cache,
  lng: 'en' | 'es' | 'pt' | 'th'
) {
  // Construct request
  const request = {
    parent: `projects/${projectId}/locations/${location}`,
    contents: [text],
    mimeType: 'text/plain', // mime types: text/plain, text/html
    sourceLanguageCode: 'en',
    targetLanguageCode: 'es',
  };

  // Run request
  const [res] = await translationClient.translateText(request);

  for (const translation of ensure(res.translations)) {
    console.log(`Translation: ${translation.translatedText}`);
  }

  const columnNames = Object.keys(columns).reduce((acc, curr) => {
    return {
      ...acc,
      [curr]: curr,
    };
  }, {} as Record<string, string>);

  const optionNames = options
    ? Object.entries(options).reduce((acc, [key, values]) => {
        return {
          ...acc,
          [key]: values.reduce((acc, curr) => {
            return { ...acc, [curr]: curr };
          }, {}),
        };
      }, {})
    : {};

  const translatable = {
    columns: columnNames,
    options: optionNames,
  };

  if (lng === 'en') {
    return translatable;
  }
  const language =
    lng === 'es'
      ? 'spanish'
      : lng === 'th'
      ? 'thai'
      : lng === 'pt'
      ? 'portuguese'
      : 'english';
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
