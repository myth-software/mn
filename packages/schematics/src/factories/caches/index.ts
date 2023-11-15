import { chain, move, Rule, template, url } from '@angular-devkit/schematics';
import { BasicOptions } from '@mountnotion/types';
import { ensure, getCache, log, strings } from '@mountnotion/utils';
import * as dotenv from 'dotenv';
import { applyWithOverwrite } from '../../rules';
import { validateInputs } from './validate-inputs';

dotenv.config();
export function caches(options: BasicOptions): Rule {
  log.success({ action: 'running', message: 'caches schematic' });
  log.success({ action: '-------', message: '------------------' });
  validateInputs(options);
  const { outDir } = options;
  const excludes = options.excludes ?? [];

  return async () => {
    const caches = ensure(getCache());
    const includedCaches = caches.filter(
      ({ title }) => title && !excludes.includes(title)
    );
    const titles = includedCaches.map((cache) => cache.title);
    const cachesRules = includedCaches.map((cache) => {
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
    const cachesIndexRule = applyWithOverwrite(url('./files/index'), [
      template({
        titles,
        options,
        log,
        ...strings,
      }),
      move(outDir),
    ]);
    return chain([...cachesRules, cachesIndexRule]);
  };
}
