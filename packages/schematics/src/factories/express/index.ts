import { chain, move, Rule, template, url } from '@angular-devkit/schematics';
import { createDatabaseCaches } from '@mountnotion/sdk';
import { ControllersOptions } from '@mountnotion/types';
import { logger, logSuccess, strings } from '@mountnotion/utils';
import { applyWithOverwrite } from '../../rules';
import { validateInputs } from './validate-inputs';

export function express(options: ControllersOptions): Rule {
  logSuccess({ action: 'running', message: 'express schematic' });
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
      const expressRules = includedCaches.map((cache) => {
        const { title } = cache;

        return applyWithOverwrite(url('./files/all'), [
          template({
            title,
            cache,
            org: options.org,
            entities: options.entities,
            locals: options.locals,
            strategy: options.strategy,
            userColumn: options.userColumn,
            accessorProperty: options.accessorProperty,
            usersDatabase: options.usersDatabase,
            debug: options.debug,
            logger,
            ...strings,
          }),
          move(outDir),
        ]);
      });

      const expressIndexRule = applyWithOverwrite(url('./files/index'), [
        template({
          titles,
          debug: options.debug,
          logger,
          ...strings,
        }),
        move(outDir),
      ]);

      return chain([...expressRules, expressIndexRule]);
    });
  };
}
