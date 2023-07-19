import { chain, move, Rule, template, url } from '@angular-devkit/schematics';
import { ControllersOptions } from '@mountnotion/types';
import { ensure, getCache, log, strings } from '@mountnotion/utils';
import { applyWithOverwrite } from '../../rules';
import { validateInputs } from './validate-inputs';

export function controllers(options: ControllersOptions): Rule {
  log.success({ action: 'running', message: 'controllers schematic' });
  log.success({ action: '-------', message: '---------------------' });
  validateInputs(options);

  const outDir = options.outDir;
  const excludes = options.excludes ?? [];
  return async () => {
    const caches = ensure(getCache());
    const includedCaches = caches.filter(
      ({ title }) => title && !excludes.includes(title)
    );
    const titles = includedCaches.map((cache) => cache.title);
    const controllersRules = includedCaches.map((cache) => {
      return applyWithOverwrite(url('./files/all'), [
        template({
          title: cache.title,
          cache,
          options,
          isPublic: options.public?.includes(cache.title) ?? false,
          log,
          ...strings,
        }),
        move(outDir),
      ]);
    });
    const controllersIndexRule = applyWithOverwrite(url('./files/index'), [
      template({
        titles,
        options,
        ...strings,
      }),
      move(outDir),
    ]);

    const controllersMnRule = applyWithOverwrite(url('./files/mn'), [
      template({
        titles,
        options,
        ...strings,
      }),
      move(outDir),
    ]);
    return chain([
      ...controllersRules,
      controllersIndexRule,
      controllersMnRule,
    ]);
  };
}
