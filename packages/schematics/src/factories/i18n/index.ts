import { chain, move, Rule, template, url } from '@angular-devkit/schematics';
import { I18nOptions, Options, Schema } from '@mountnotion/types';
import { ensure, getSchema, log, strings } from '@mountnotion/utils';
import { applyWithOverwrite } from '../../rules';
import { getTranslation } from '../../utils/get-translation.util';
import { validateInputs } from './validate-inputs';

type FormattedTranslations = {
  [lng: string]: {
    [schema: string]: {
      options: Options | null | undefined;
      columns: Record<string, string> | undefined;
    };
  };
};
export function i18n(options: I18nOptions): Rule {
  log.success({ action: 'running', message: 'i18n schematic' });
  log.success({ action: '-------', message: '--------------' });
  validateInputs(options);
  const outDir = options.outDir;
  const excludes = options.excludes ?? [];
  let schemaRef: Schema[] = [];
  let titlesRef: string[] = [];

  return async () => {
    const schema = ensure(getSchema());
    const includedSchema = schema.filter(
      (schema) => schema.title && !excludes.includes(schema.title)
    );
    const translations: FormattedTranslations = {};
    while (options.languages.length > 0) {
      const lng = options.languages.shift();

      if (!lng) {
        throw new Error('no language found');
      }

      schemaRef = includedSchema;
      const translationPromises = includedSchema.map((schema) =>
        getTranslation(schema, lng)
      );

      const schema = await Promise.all(translationPromises);

      const formatted = includedSchema.reduce((acc, curr, i) => {
        return {
          ...acc,
          [curr.title]: schema[i],
        };
      }, {} as FormattedTranslations[string]);

      translations[lng] = formatted;
    }
    const translations_1 = await translations;
    titlesRef = schemaRef.map((schema) => schema.title) as string[];
    const rules = Object.entries(translations_1).reduce(
      (acc_1, [lng_1, schema_1]) => {
        const translationsRules = Object.entries(schema_1).map(
          ([title, { options, columns }]) => {
            return applyWithOverwrite(url('./files/all-for-language'), [
              template({
                title,
                options,
                columns,
                language: lng_1,
                log,
                ...strings,
              }),
              move(`${outDir}/${lng_1}`),
            ]);
          }
        );

        const translationsIndexRule = applyWithOverwrite(
          url('./files/index-for-language'),
          [
            template({
              titles: titlesRef,
              ...strings,
              language: lng_1,
            }),
            move(`${outDir}/${lng_1}`),
          ]
        );

        return [...acc_1, ...translationsRules, translationsIndexRule];
      },
      [] as Rule[]
    );
    const translationRootIndexRule = applyWithOverwrite(url('./files/index'), [
      template({
        languages: options.languages,
        log,
        ...strings,
      }),
      move(outDir),
    ]);
    return chain([...rules, translationRootIndexRule]);
  };
}
