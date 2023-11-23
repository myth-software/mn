import { chain, move, Rule, template, url } from '@angular-devkit/schematics';
import { BasicOptions } from '@mountnotion/types';
import { ensure, getCache, log, strings } from '@mountnotion/utils';
import { applyWithOverwrite } from '../../rules';
import { validateBasicInputs } from '../../utils';
import path = require('path');

export function reactQuery(options: BasicOptions): Rule {
  log.success({ action: 'running', message: 'react query schematic' });
  log.success({ action: '-------', message: '---------------------' });
  validateBasicInputs(options);

  const outDir = path.resolve(process.cwd(), options.outDir);
  const excludes = options.excludes ?? [];
  return async () => {
    const caches = ensure(getCache());
    const includedCaches = caches.filter(
      (cache) => cache.title && !excludes.includes(cache.title)
    );
    const titles = includedCaches.map((cache_1) => cache_1.title);
    const files = './files';
    const infrastructuresRules = includedCaches.map((cache) => {
      return applyWithOverwrite(url(`${files}/infrastructure-all`), [
        template({
          title: cache.title,
          cache,
          options,
          log,
          ...strings,
        }),
        move(`${outDir}/infrastructure`),
      ]);
    });
    const infrastructuresIndexRule = applyWithOverwrite(
      url(`${files}/infrastructure-index`),
      [
        template({
          titles,
          log,
          ...strings,
        }),
        move(`${outDir}/infrastructure`),
      ]
    );
    const infrastructuresInterfaceRule = applyWithOverwrite(
      url(`${files}/infrastructure-interface`),
      [move(`${outDir}/infrastructure`)]
    );
    const statesRules = includedCaches.map((cache) => {
      return applyWithOverwrite(url(`${files}/+state-all`), [
        template({
          title: cache.title,
          cache,
          options,
          log,
          ...strings,
        }),
        move(`${outDir}/+state`),
      ]);
    });
    const statesIndexRule = applyWithOverwrite(url(`${files}/+state-index`), [
      template({
        titles,
        options,
        log,
        ...strings,
      }),
      move(`${outDir}/+state`),
    ]);
    const domainIndexRule = applyWithOverwrite(url(`${files}/index`), [
      move(outDir),
    ]);
    return chain([
      ...infrastructuresRules,
      infrastructuresInterfaceRule,
      infrastructuresIndexRule,
      ...statesRules,
      statesIndexRule,
      domainIndexRule,
    ]);
  };
}
