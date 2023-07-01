import { chain, move, Rule, template, url } from '@angular-devkit/schematics';
import { createDatabaseCaches } from '@mountnotion/sdk';
import { Cache, LocalsOptions } from '@mountnotion/types';
import { logSuccess, strings } from '@mountnotion/utils';
import { rimraf } from 'rimraf';
import { applyWithOverwrite } from '../../rules';
import { getlocals } from '../../utils';

/**
 *
 * @returns rules for creating locals where the filename and related code does
 * not include '?', though 'title' strings do
 */
export function locals(options: LocalsOptions): Rule {
  logSuccess({ action: 'running', message: 'locals schematic' });
  logSuccess({ action: '-------', message: '----------------' });
  const { outDir, entities } = options;
  const pageIds = [options.pageId].flat();
  const excludes = options.excludes ?? [];
  let cachesRef: Cache[] = [];
  let titlesRef: string[] = [];

  return async () => {
    await rimraf(outDir);
    const caches = await createDatabaseCaches(pageIds, options);
    const includedCaches = caches.filter(
      ({ title }) => title && !excludes.includes(title)
    );
    cachesRef = includedCaches;
    const localsPromises = includedCaches.map((cache) =>
      getlocals({ ...options, pageId: cache.id })
    );
    const locals = await Promise.all(localsPromises);
    const rules = locals
      .map(({ title: title_1, locals: locals_1 }) => {
        titlesRef = cachesRef.map(({ title: title_2 }) => title_2) as string[];
        const localsRules = locals_1.map((local) => {
          const { title: localTitle, ...rest } = local;
          const formattedTitle = strings.titlize(localTitle);
          return applyWithOverwrite(url('./files/all-for-entity'), [
            template({
              title: formattedTitle,
              local: rest,
              entities,
              databaseName: title_1,
              ...strings,
            }),
            move(`${outDir}/${strings.dasherize(title_1)}`),
          ]);
        });

        const localsIndexRule = applyWithOverwrite(
          url('./files/index-for-entity'),
          [
            template({
              locals: locals_1.map((local_2) => ({
                ...local_2,
                title: strings.titlize(local_2.title),
              })),
              titles: titlesRef,
              entities,
              databaseName: title_1,
              ...strings,
            }),
            move(`${outDir}/${strings.dasherize(title_1)}`),
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
  };
}
