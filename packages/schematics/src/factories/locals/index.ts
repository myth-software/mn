import { strings } from '@angular-devkit/core';
import { chain, move, Rule, template, url } from '@angular-devkit/schematics';
import { createDatabaseCaches } from '@mountnotion/tools';
import { Cache, LocalsOptions } from '@mountnotion/types';
import { applyWithoutOverwrite, applyWithOverwrite } from '../../rules';
import { getlocals } from '../../utils';

/**
 *
 * @returns rules for creating locals where the filename and related code does
 * not include '?', though 'title' strings do
 */
export function locals(options: LocalsOptions): Rule {
  const { outDir, entities } = options;
  const pageIds = [options.pageId].flat();
  const excludes = options.excludes ?? [];
  let cachesRef: Cache[] = [];
  let titlesRef: string[] = [];
  return () =>
    createDatabaseCaches(pageIds, options)
      .then((caches) => {
        const includedCaches = caches.filter(
          ({ title }) => title && !excludes.includes(title)
        );
        cachesRef = includedCaches;
        const localsPromises = includedCaches.map((cache) =>
          getlocals({ ...options, pageId: cache.id })
        );
        return Promise.all(localsPromises);
      })
      .then((locals) => {
        const rules = locals
          .map(({ title, locals }) => {
            titlesRef = cachesRef.map(({ title }) => title) as string[];
            const localsRules = locals.map((local) => {
              const { title: localTitle, ...rest } = local;
              const formattedTitle = localTitle
                .replace('?', '')
                .replace("'", '')
                .replace('’', '');

              return applyWithoutOverwrite(url('./files/all-for-entity'), [
                template({
                  title: formattedTitle,
                  local: rest,
                  entities,
                  databaseName: title,
                  ...strings,
                }),
                move(`${outDir}/${strings.dasherize(title)}`),
              ]);
            });

            const localsIndexRule = applyWithOverwrite(
              url('./files/index-for-entity'),
              [
                template({
                  locals: locals.map((local) => ({
                    ...local,
                    title: local.title
                      .replace('?', '')
                      .replace("'", '')
                      .replace('’', ''),
                  })),
                  titles: titlesRef,
                  entities,
                  databaseName: title,
                  ...strings,
                }),
                move(`${outDir}/${strings.dasherize(title)}`),
              ]
            );

            return [...localsRules, localsIndexRule];
          })
          .flat();

        const localsRootIndexRule = applyWithOverwrite(url('./files/index'), [
          template({
            titles: titlesRef,
            entities,
            ...strings,
          }),
          move(outDir),
        ]);
        return chain([...rules, localsRootIndexRule]);
      });
}
