import { strings } from '@angular-devkit/core';
import { chain, move, Rule, template, url } from '@angular-devkit/schematics';
import { createDatabaseCaches } from '@mountnotion/sdk';
import { ControllersOptions } from '@mountnotion/types';
import { applyWithOverwrite } from '../../rules';
import { validateInputs } from './validate-inputs';

export function controllers(options: ControllersOptions): Rule {
  validateInputs(options);

  const outDir = options.outDir;
  const pageIds = [options.pageId].flat();
  const excludes = options.excludes ?? [];
  return () => {
    return createDatabaseCaches(pageIds, options).then((caches) => {
      const includedCaches = caches.filter(
        ({ title }) => title && !excludes.includes(title)
      );
      const titles = includedCaches.map(({ title }) => title);
      const controllersRules = includedCaches.map((cache) => {
        const { title } = cache;

        return applyWithOverwrite(url('./files/all'), [
          template({
            title,
            index: cache,
            org: options.org,
            entities: options.entities,
            locals: options.locals,
            strategy: options.strategy,
            userColumn: options.userColumn,
            accessorProperty: options.accessorProperty,
            usersDatabase: options.usersDatabase,
            ...strings,
          }),
          move(outDir),
        ]);
      });

      const controllersIndexRule = applyWithOverwrite(url('./files/index'), [
        template({
          titles,
          ...strings,
        }),
        move(outDir),
      ]);

      return chain([...controllersRules, controllersIndexRule]);
    });
  };
}
