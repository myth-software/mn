import { strings } from '@angular-devkit/core';
import { chain, move, Rule, template, url } from '@angular-devkit/schematics';
import { createDatabaseCaches } from '@mountnotion/tools';
import { BasicOptions } from '@mountnotion/types';
import * as dotenv from 'dotenv';
import { applyWithOverwrite } from '../../rules';
import { validateInputs } from './validate-inputs';

dotenv.config();
export function entities(options: BasicOptions): Rule {
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
            ...strings,
          }),
          move(outDir),
        ]);
      });

      const entitiesIndexRule = applyWithOverwrite(url('./files/index'), [
        template({
          titles,
          ...strings,
        }),
        move(outDir),
      ]);

      return chain([...entitiesRules, entitiesIndexRule]);
    });
  };
}
