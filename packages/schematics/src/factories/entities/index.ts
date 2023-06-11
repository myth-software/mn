import { chain, move, Rule, template, url } from '@angular-devkit/schematics';
import { createDatabaseCaches } from '@mountnotion/sdk';
import { BasicOptions } from '@mountnotion/types';
import { logDebug, logSuccess, strings } from '@mountnotion/utils';
import * as dotenv from 'dotenv';
import { applyWithOverwrite } from '../../rules';
import { validateInputs } from './validate-inputs';

dotenv.config();
export function entities(options: BasicOptions): Rule {
  logSuccess({ action: 'running', message: 'entities schematic' });
  validateInputs(options);
  const { outDir } = options;
  const pageIds = [options.pageId].flat();
  const excludes = options.excludes ?? [];

  return () => {
    return createDatabaseCaches(pageIds, options).then((caches) => {
      const includedCaches = caches.filter(
        ({ title }) => title && !excludes.includes(title)
      );
      const titles = includedCaches.map(({ title }) => title);

      const entitiesRules = includedCaches.map((cache) => {
        return applyWithOverwrite(url('./files/all'), [
          template({
            ...cache,
            debug: options.debug,
            logDebug,
            ...strings,
          }),
          move(outDir),
        ]);
      });

      const entitiesIndexRule = applyWithOverwrite(url('./files/index'), [
        template({
          titles,
          debug: options.debug,
          logDebug,
          ...strings,
        }),
        move(outDir),
      ]);

      return chain([...entitiesRules, entitiesIndexRule]);
    });
  };
}
