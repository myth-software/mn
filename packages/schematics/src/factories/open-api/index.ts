import { chain, move, Rule, template, url } from '@angular-devkit/schematics';
import { AuthOptions, BasicOptions } from '@mountnotion/types';
import { ensure, getCache, log, strings } from '@mountnotion/utils';
import { applyWithOverwrite } from '../../rules';
import { validateAuthInputs, validateBasicInputs } from '../../utils';

export function openApi(options: BasicOptions & AuthOptions): Rule {
  log.success({ action: 'running', message: 'open api schematic' });
  log.success({ action: '-------', message: '------------------' });
  validateBasicInputs(options);
  validateAuthInputs(options);

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
          entities: options.entities,
          strategies: options.strategies,
          userColumn: options.userColumn,
          usersDatabase: options.usersDatabase,
          log,
          ...strings,
        }),
        move(outDir),
      ]);
    });
    const controllersIndexRule = applyWithOverwrite(url('./files/index'), [
      template({
        titles,
        log,
        ...strings,
      }),
      move(outDir),
    ]);
    return chain([...controllersRules, controllersIndexRule]);
  };
}
