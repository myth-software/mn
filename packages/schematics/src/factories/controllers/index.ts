import { chain, move, Rule, template, url } from '@angular-devkit/schematics';
import { createDatabaseCaches } from '@mountnotion/sdk';
import { ControllersOptions } from '@mountnotion/types';
import { logDebug, logSuccess, strings } from '@mountnotion/utils';
import { applyWithOverwrite } from '../../rules';
import { validateInputs } from './validate-inputs';

export function controllers(options: ControllersOptions): Rule {
  logSuccess({ action: 'running', message: 'controllers schematic' });
  logSuccess({ action: '-------', message: '---------------------' });
  validateInputs(options);

  const outDir = options.outDir;
  const pageIds = [options.pageId].flat();
  const excludes = options.excludes ?? [];
  return async () => {
    const caches = await createDatabaseCaches(pageIds, options);
    const includedCaches = caches.filter(
      ({ title }) => title && !excludes.includes(title)
    );
    const titles = includedCaches.map((cache) => cache.title);
    const controllersRules = includedCaches.map((cache) => {
      return applyWithOverwrite(url('./files/all'), [
        template({
          title: cache.title,
          cache,
          options,
          org: options.org,
          entities: options.entities,
          locals: options.locals,
          strategies: options.strategies,
          userColumn: options.userColumn,
          accessorProperty: options.accessorProperty,
          usersDatabase: options.usersDatabase,
          isPublic: options.public?.includes(cache.title) ?? false,
          debug: options.debug,
          logDebug,
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
  };
}
