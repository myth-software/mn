import { strings } from '@angular-devkit/core';
import { chain, move, Rule, template, url } from '@angular-devkit/schematics';
import { createDatabaseCaches } from '@mountnotion/sdk';
import { BasicOptions } from '@mountnotion/types';
import * as dotenv from 'dotenv';
import { applyWithOverwrite } from '../../rules';
import { validateBasicInputs } from '../../utils';

dotenv.config();
export function interfaces(options: BasicOptions): Rule {
  validateBasicInputs(options);

  const pageIds = [options.pageId].flat();
  const excludes = options.excludes ?? [];
  return () => {
    return createDatabaseCaches(pageIds, options).then((caches) => {
      const includedCaches = caches.filter(
        ({ title }) => title && !excludes.includes(title)
      );
      const titles = includedCaches.map(({ title }) => title);

      const interfacesRules = includedCaches.map((cache) => {
        return applyWithOverwrite(url('./files/all'), [
          template({
            title: cache.title,
            index: cache,
            ...strings,
          }),
          move(options.outDir ?? 'out/interfaces'),
        ]);
      });

      const interfacesIndexRule = applyWithOverwrite(url('./files/index'), [
        template({
          titles,
          ...strings,
        }),
        move(options.outDir ?? 'out/interfaces'),
      ]);

      return chain([...interfacesRules, interfacesIndexRule]);
    });
  };
}
