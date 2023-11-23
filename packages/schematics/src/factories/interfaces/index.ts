import { chain, move, Rule, template, url } from '@angular-devkit/schematics';
import { BasicOptions } from '@mountnotion/types';
import { ensure, getCache, log, strings } from '@mountnotion/utils';
import { applyWithOverwrite } from '../../rules';
import { validateBasicInputs } from '../../utils';
import path = require('path');

export function interfaces(options: BasicOptions): Rule {
  log.success({ action: 'running', message: 'interfaces schematic' });
  log.success({ action: '-------', message: '--------------------' });
  validateBasicInputs(options);
  const outDir = path.resolve(process.cwd(), options.outDir);
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
        move(outDir),
      ]);
    });
    const interfacesIndexRule = applyWithOverwrite(url('./files/index'), [
      template({
        titles,
        log,
        ...strings,
      }),
      move(outDir),
    ]);
    return chain([...interfacesRules, interfacesIndexRule]);
  };
}
