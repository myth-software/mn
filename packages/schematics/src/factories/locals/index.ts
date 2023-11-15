import { chain, move, Rule, template, url } from '@angular-devkit/schematics';
import { Cache, LocalsOptions } from '@mountnotion/types';
import {
  ensure,
  getCache,
  getTitleColumnFromCache,
  log,
  strings,
} from '@mountnotion/utils';
import { rimraf } from 'rimraf';
import { applyWithOverwrite } from '../../rules';
import { getlocals } from '../../utils';

/**
 *
 * @returns rules for creating locals where the filename and related code does
 * not include '?', though 'title' strings do
 */
export function locals(options: LocalsOptions): Rule {
  log.success({ action: 'running', message: 'locals schematic' });
  log.success({ action: '-------', message: '----------------' });

  const excludes = options.excludes ?? [];
  let cachesRef: Cache[] = [];
  let titlesRef: string[] = [];

  return async () => {
    await rimraf(options.outDir);
    const caches = ensure(getCache());
    const includedCaches = caches.filter(
      ({ title }) => title && !excludes.includes(title)
    );
    cachesRef = includedCaches;
    const localsPromises = includedCaches.map((cache) =>
      getlocals({ ...options, pageId: cache.id })
    );
    const localsResponse = await Promise.all(localsPromises);
    const rules = localsResponse
      .map(({ title, locals }) => {
        titlesRef = cachesRef.map((cache) => cache.title) as string[];
        const cache = cachesRef.find((cache) => cache.title === title);
        const TITLE = getTitleColumnFromCache(cache as Cache);
        const localsRules = locals.map((local) => {
          const { [TITLE]: localTitle } = local;
          const formattedTitle = strings.titlize(localTitle);
          return applyWithOverwrite(url('./files/all-for-cache'), [
            template({
              title: formattedTitle,
              options,
              local,
              databaseName: title,
              log,
              ...strings,
            }),
            move(`${options.outDir}/${strings.dasherize(title)}`),
          ]);
        });

        const localsIndexRule = applyWithOverwrite(
          url('./files/index-for-cache'),
          [
            template({
              options,
              locals: locals.map((local) => ({
                ...local,
                title: strings.titlize(local[TITLE]),
              })),
              titles: titlesRef,
              log,
              databaseName: title,
              ...strings,
            }),
            move(`${options.outDir}/${strings.dasherize(title)}`),
          ]
        );

        return [...localsRules, localsIndexRule];
      })
      .flat();
    const localsRootIndexRule = applyWithOverwrite(url('./files/index'), [
      template({
        titles: titlesRef,
        options,
        log,
        ...strings,
      }),
      move(options.outDir),
    ]);
    return chain([...rules, localsRootIndexRule]);
  };
}
