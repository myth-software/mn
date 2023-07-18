import { chain, move, Rule, template, url } from '@angular-devkit/schematics';
import { ExpressOptions } from '@mountnotion/types';
import { ensure, getCache, log, strings } from '@mountnotion/utils';
import { rimraf } from 'rimraf';
import { applyWithOverwrite } from '../../rules';
import { addPackageToPackageJson } from '../../utils';
import { validateInputs } from './validate-inputs';

export function express(options: ExpressOptions): Rule {
  log.success({ action: 'running', message: 'express schematic' });
  log.success({ action: '-------', message: '-----------------' });
  validateInputs(options);

  const outDir = options.outDir;
  const excludes = options.excludes ?? [];
  return async (tree) => {
    await rimraf(outDir);
    addPackageToPackageJson(tree, 'helmet', '7.0.0');
    addPackageToPackageJson(tree, 'cors', '2.8.5');
    const caches = ensure(getCache());
    const includedCaches = caches.filter(
      ({ title }) => title && !excludes.includes(title)
    );
    const titles = includedCaches.map((cache) => cache.title);
    const routerRules = includedCaches.map((cache) => {
      return applyWithOverwrite(url('./files/routers'), [
        template({
          title: cache.title,
          cache,
          options,
          log,
          ...strings,
        }),
        move(`${outDir}/routers`),
      ]);
    });
    const controllerRules = includedCaches.map((cache) => {
      return applyWithOverwrite(url('./files/controllers'), [
        template({
          title: cache.title,
          cache,
          options,
          log,
          ...strings,
        }),
        move(`${outDir}/controllers`),
      ]);
    });
    const middlewareRule = applyWithOverwrite(url('./files/middleware'), [
      template({
        titles,
        options,
        log,
        ...strings,
      }),
      move(`${outDir}/middleware`),
    ]);
    const expressIndexRule = applyWithOverwrite(url('./files/index'), [
      template({
        titles,
        options,
        log,
        ...strings,
      }),
      move(outDir),
    ]);
    return chain([
      ...routerRules,
      ...controllerRules,
      middlewareRule,
      expressIndexRule,
    ]);
  };
}
