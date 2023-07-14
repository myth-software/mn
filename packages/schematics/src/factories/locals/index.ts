import { chain, move, Rule, template, url } from '@angular-devkit/schematics';
import { createDatabaseCaches } from '@mountnotion/sdk';
import { Cache, LocalsOptions } from '@mountnotion/types';
import { log, strings } from '@mountnotion/utils';
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
    const localsResponse = await Promise.all(localsPromises);
    const rules = localsResponse
      .map(({ title, locals }) => {
        titlesRef = cachesRef.map((cache) => cache.title) as string[];
        const localsRules = locals.map((local) => {
          const { title: localTitle, ...rest } = local;
          const formattedTitle = strings.titlize(localTitle);
          return applyWithOverwrite(url('./files/all-for-entity'), [
            template({
              title: formattedTitle,
              local: rest,
              entities,
              databaseName: title,
              log,
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
                title: strings.titlize(local.title),
              })),
              titles: titlesRef,
              entities,
              log,
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
        log,
        ...strings,
      }),
      move(outDir),
    ]);
    return chain([...rules, localsRootIndexRule]);
  };
}
