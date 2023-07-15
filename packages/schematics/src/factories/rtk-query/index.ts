import * as dotenv from 'dotenv';
dotenv.config();

import { chain, move, Rule, template, url } from '@angular-devkit/schematics';
import { RtkQueryOptions } from '@mountnotion/types';
import { ensure, getCache, log, strings } from '@mountnotion/utils';
import { applyWithOverwrite } from '../../rules';
import { validateInputs } from './validate-inputs';

export function rtkQuery(options: RtkQueryOptions): Rule {
  log.success({ action: 'running', message: 'rtk query schematic' });
  log.success({ action: '-------', message: '-------------------' });
  validateInputs(options);
  const { outDir } = options;
  const excludes = options.excludes ?? [];
  return async () => {
    const caches = ensure(getCache());
    const includedCaches = caches.filter(
      ({ title }) => title && !excludes.includes(title)
    );
    const titles = includedCaches.map((cache) => cache.title);
    const files = './files';
    const apisRules = includedCaches
      .filter((cache) => cache.title !== options.usersDatabase)
      .map((cache) => {
        return applyWithOverwrite(url(`${files}/apis-all`), [
          template({
            title: cache.title,
            cache,
            options,
            log,
            ...strings,
          }),
          move(`${outDir}/apis`),
        ]);
      });
    const apisIndexRule = options.strategies
      ? applyWithOverwrite(url(`${files}/apis-auth-index`), [
          template({
            titles,
            log,
            ...strings,
          }),
          move(`${outDir}/apis`),
        ])
      : applyWithOverwrite(url(`${files}/apis-index`), [
          template({
            titles,
            log,
            ...strings,
          }),
          move(`${outDir}/apis`),
        ]);
    const domainIndexRule = options.strategies
      ? applyWithOverwrite(url(`${files}/auth-index`), [
          template({
            titles,
            log,
            ...strings,
          }),
          move(outDir),
        ])
      : applyWithOverwrite(url(`${files}/index`), [
          template({
            titles,
            log,
            ...strings,
          }),
          move(outDir),
        ]);
    return chain([...apisRules, apisIndexRule, domainIndexRule]);
  };
}
