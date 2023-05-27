import { chain, move, Rule, template, url } from '@angular-devkit/schematics';
import { createDatabaseCaches } from '@mountnotion/sdk';
import { BasicOptions } from '@mountnotion/types';
import { strings } from '@mountnotion/utils';
import * as dotenv from 'dotenv';
import { applyWithOverwrite } from '../../rules';
import { validateInputs } from './validate-inputs';

dotenv.config();
export function zod(options: BasicOptions): Rule {
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

      const zodRules = includedCaches.map((cache) => {
        return applyWithOverwrite(url('./files/all'), [
          template({
            title: cache.title,
            cache,
            ...strings,
          }),
          move(outDir),
        ]);
      });

      const zodIndexRule = applyWithOverwrite(url('./files/index'), [
        template({
          titles,
          ...strings,
        }),
        move(outDir),
      ]);

      return chain([...zodRules, zodIndexRule]);
    });
  };
}
