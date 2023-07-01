import { chain, move, Rule, template, url } from '@angular-devkit/schematics';
import { createDatabaseCaches } from '@mountnotion/sdk';
import { ControllersOptions } from '@mountnotion/types';
import { logDebug, logSuccess, strings } from '@mountnotion/utils';
import { applyWithOverwrite } from '../../rules';
import { addPackageToPackageJson } from '../../utils';
import { validateInputs } from './validate-inputs';

export function express(options: ControllersOptions): Rule {
  logSuccess({ action: 'running', message: 'express schematic' });
  validateInputs(options);

  const outDir = options.outDir;
  const pageIds = [options.pageId].flat();
  const excludes = options.excludes ?? [];
  return (tree) => {
    addPackageToPackageJson(tree, 'helmet', '7.0.0');
    addPackageToPackageJson(tree, 'cors', '2.8.5');
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
            entities: options.entities,
            locals: options.locals,
            strategies: options.strategies,
            userColumn: options.userColumn,
            accessorProperty: options.accessorProperty,
            usersDatabase: options.usersDatabase,
            debug: options.debug,
            logDebug,
            ...strings,
          }),
          move(outDir),
        ]);
      });

      const expressIndexRule = applyWithOverwrite(url('./files/index'), [
        template({
          titles,
          debug: options.debug,
          logDebug,
          ...strings,
        }),
        move(outDir),
      ]);

      return chain([...expressRules, expressIndexRule]);
    });
  };
}
