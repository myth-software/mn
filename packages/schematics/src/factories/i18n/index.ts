import * as dotenv from 'dotenv';
dotenv.config();

import { strings } from '@angular-devkit/core';
import { chain, move, Rule, template, url } from '@angular-devkit/schematics';
import { createDatabaseCaches } from '@mountnotion/tools';
import { Cache, I18nOptions, Options } from '@mountnotion/types';
import { applyWithOverwrite } from '../../rules';
import { getTranslation } from '../../utils/get-translation.util';
import { validateInputs } from './validate-inputs';

type FormattedTranslations = {
  [lng: string]: {
    [entity: string]: {
      options: Options | null | undefined;
      columns: Record<string, string> | undefined;
    };
  };
};
export function i18n(options: I18nOptions): Rule {
  validateInputs(options);
  const { outDir } = options;
  const pageIds = [options.pageId].flat();
  const excludes = options.excludes ?? [];
  let cachesRef: Cache[] = [];
  let titlesRef: string[] = [];

  return () => {
    return createDatabaseCaches(pageIds, options)
      .then(async (caches) => {
        const includedCaches = caches.filter(
          ({ title }) => title && !excludes.includes(title)
        );
        const translations: FormattedTranslations = {};

        while (options.languages.length > 0) {
          const lng = options.languages.shift();

          if (!lng) {
            throw new Error('no language found');
          }

          cachesRef = includedCaches;
          const translationPromises = includedCaches.map((cache) =>
            getTranslation(cache, lng)
          );
          const entities = await Promise.all(translationPromises);

          const formatted = includedCaches.reduce((acc, curr, i) => {
            return {
              ...acc,
              [curr.title]: entities[i],
            };
          }, {} as FormattedTranslations[string]);

          translations[lng] = formatted;
        }
        return translations;
      })
      .then((translations) => {
        titlesRef = cachesRef.map(({ title }) => title) as string[];
        const rules = Object.entries(translations).reduce(
          (acc, [lng, entities]) => {
            const translationsRules = Object.entries(entities).map(
              ([title, { options, columns }]) => {
                return applyWithOverwrite(url('./files/all-for-language'), [
                  template({
                    title,
                    options,
                    columns,
                    language: lng,
                    ...strings,
                  }),
                  move(`${outDir}/${lng}`),
                ]);
              }
            );

            const translationsIndexRule = applyWithOverwrite(
              url('./files/index-for-language'),
              [
                template({
                  titles: titlesRef,
                  ...strings,
                  language: lng,
                }),
                move(`${outDir}/${lng}`),
              ]
            );

            return [...acc, ...translationsRules, translationsIndexRule];
          },
          [] as Rule[]
        );

        const translationRootIndexRule = applyWithOverwrite(
          url('./files/index'),
          [
            template({
              languages: options.languages,
              ...strings,
            }),
            move(outDir),
          ]
        );

        return chain([...rules, translationRootIndexRule]);
      });
  };
}
