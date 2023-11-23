import { chain, move, Rule, template, url } from '@angular-devkit/schematics';
import { ExpressOptions } from '@mountnotion/types';
import { ensure, getCache, log, strings } from '@mountnotion/utils';
import { applyWithoutOverwrite, applyWithOverwrite } from '../../rules';
import { addPackageToPackageJson } from '../../utils';
import { validateInputs } from './validate-inputs';
import path = require('path');

export function express(options: ExpressOptions): Rule {
  log.success({ action: 'running', message: 'express schematic' });
  log.success({ action: '-------', message: '-----------------' });
  validateInputs(options);

  const outDir = path.resolve(process.cwd(), options.outDir);
  const excludes = options.excludes ?? [];
  return async (tree) => {
    addPackageToPackageJson(tree, 'helmet', '7.0.0');
    addPackageToPackageJson(tree, 'cors', '2.8.5');

    const caches = ensure(getCache());
    const includedCaches = caches.filter(
      ({ title }) => title && !excludes.includes(title)
    );
    const titles = includedCaches.map((cache) => cache.title);
    const routerRules = includedCaches.map((cache) => {
      return applyWithoutOverwrite(url('./files/routers'), [
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
    const actionRouterRules = options.actionRouter
      ? includedCaches.map((cache) => {
          return applyWithoutOverwrite(url('./files/routers-action'), [
            template({
              title: cache.title,
              cache,
              options,
              log,
              ...strings,
            }),
            move(`${outDir}/routers`),
          ]);
        })
      : [];
    const controllerRules = includedCaches.map((cache) => {
      return options.eject
        ? applyWithOverwrite(url('./files/controllers-eject'), [
            template({
              title: cache.title,
              cache,
              options,
              log,
              ...strings,
            }),
            move(`${outDir}/controllers`),
          ])
        : applyWithoutOverwrite(url('./files/controllers'), [
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
    const middlewareRule = applyWithoutOverwrite(url('./files/middleware'), [
      template({
        titles,
        options,
        log,
        ...strings,
      }),
      move(`${outDir}/middleware`),
    ]);
    const expressIndexRule = applyWithoutOverwrite(url('./files/index'), [
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
      ...actionRouterRules,
      ...controllerRules,
      middlewareRule,
      expressIndexRule,
    ]);
  };
}
