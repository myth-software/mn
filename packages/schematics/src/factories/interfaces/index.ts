import { chain, move, Rule, template, url } from '@angular-devkit/schematics';
import { BasicOptions } from '@mountnotion/types';
import { ensure, getCache, log, strings } from '@mountnotion/utils';
import * as dotenv from 'dotenv';
import { applyWithOverwrite } from '../../rules';
import { validateBasicInputs } from '../../utils';

dotenv.config();
export function interfaces(options: BasicOptions): Rule {
  log.success({ action: 'running', message: 'interfaces schematic' });
  log.success({ action: '-------', message: '--------------------' });
  validateBasicInputs(options);

  const excludes = options.excludes ?? [];
  return async () => {
    const caches = ensure(getCache());
    const includedCaches = caches.filter(
      (cache) => cache.title && !excludes.includes(cache.title)
    );
    const titles = includedCaches.map((cache) => cache.title);
    const interfacesRules = includedCaches.map((cache) => {
      return applyWithOverwrite(url('./files/all'), [
        template({
          title: cache.title,
          cache,
          options,
          log,
          ...strings,
        }),
        move(options.outDir ?? 'out/interfaces'),
      ]);
    });
    const interfacesIndexRule = applyWithOverwrite(url('./files/index'), [
      template({
        titles,
        log,
        ...strings,
      }),
      move(options.outDir ?? 'out/interfaces'),
    ]);
    return chain([...interfacesRules, interfacesIndexRule]);
  };
}
