import * as dotenv from 'dotenv';
dotenv.config();

import { chain, move, Rule, template, url } from '@angular-devkit/schematics';
import { Cache, I18nOptions, Options } from '@mountnotion/types';
import { ensure, getCache, log, strings } from '@mountnotion/utils';
import { applyWithOverwrite } from '../../rules';
import { getTranslation } from '../../utils/get-translation.util';
import { validateInputs } from './validate-inputs';

type FormattedTranslations = {
  [lng: string]: {
    [cache: string]: {
      options: Options | null | undefined;
      columns: Record<string, string> | undefined;
    };
  };
};
export function i18n(options: I18nOptions): Rule {
  log.success({ action: 'running', message: 'i18n schematic' });
  log.success({ action: '-------', message: '--------------' });
  validateInputs(options);
  const { outDir } = options;
  const excludes = options.excludes ?? [];
  let cachesRef: Cache[] = [];
  let titlesRef: string[] = [];

  return async () => {
    const caches = ensure(getCache());
    const includedCaches = caches.filter(
      (cache) => cache.title && !excludes.includes(cache.title)
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

      const caches = await Promise.all(translationPromises);

      const formatted = includedCaches.reduce((acc, curr, i) => {
        return {
          ...acc,
          [curr.title]: caches[i],
        };
      }, {} as FormattedTranslations[string]);

      translations[lng] = formatted;
    }
    const translations_1 = await translations;
    titlesRef = cachesRef.map((cache) => cache.title) as string[];
    const rules = Object.entries(translations_1).reduce(
      (acc_1, [lng_1, caches_1]) => {
        const translationsRules = Object.entries(caches_1).map(
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
