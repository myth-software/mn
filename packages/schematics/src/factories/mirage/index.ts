import { chain, move, Rule, template, url } from '@angular-devkit/schematics';
import { MirageOptions } from '@mountnotion/types';
import { ensure, getCache, log, strings } from '@mountnotion/utils';
import { applyWithOverwrite } from '../../rules';
import { validateInputs } from './validate-inputs';
import path = require('path');

export function mirage(options: MirageOptions): Rule {
  log.success({ action: 'running', message: 'mirage schematic' });
  log.success({ action: '-------', message: '----------------' });
  validateInputs(options);

  const outDir = path.resolve(process.cwd(), options.outDir);
  const excludes = options.excludes ?? [];
  return async () => {
    const caches = ensure(getCache());
    const includedCaches = caches.filter(
      ({ title }) => title && !excludes.includes(title)
    );
    const titles = includedCaches.map((cache) => cache.title);
    const files = './files';
    const endpointsRules = includedCaches.map((cache) => {
      return applyWithOverwrite(url(`${files}/endpoints-all`), [
        template({
          title: cache.title,
          cache,
          options,
          log,
          ...strings,
        }),
        move(`${outDir}/endpoints`),
      ]);
    });
    const endpointsIndexRule = options.strategies
      ? applyWithOverwrite(url(`${files}/endpoints-auth-index`), [
          template({
            titles,
            options,
            log,
            ...strings,
          }),
          move(`${outDir}/endpoints`),
        ])
      : applyWithOverwrite(url(`${files}/endpoints-index`), [
          template({
            titles,
            options,
            log,
            ...strings,
          }),
          move(`${outDir}/endpoints`),
        ]);
    const modelsRules = includedCaches.map((cache) => {
      return applyWithOverwrite(url(`${files}/models-all`), [
        template({
          title: cache.title,
          options,
          log,
          ...strings,
        }),
        move(`${outDir}/models`),
      ]);
    });
    const modelsIndexRule = applyWithOverwrite(url(`${files}/models-index`), [
      template({
        titles,
        options,
        log,
        ...strings,
      }),
      move(`${outDir}/models`),
    ]);
    const indexRule = applyWithOverwrite(url(`${files}/index`), [
      template({
        titles,
        options,
        log,
        ...strings,
      }),
      move(outDir),
    ]);
    return chain([
      ...endpointsRules,
      endpointsIndexRule,
      ...modelsRules,
      modelsIndexRule,
      indexRule,
    ]);
  };
}
