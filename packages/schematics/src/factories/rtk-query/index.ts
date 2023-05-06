import * as dotenv from 'dotenv';
dotenv.config();

import { strings } from '@angular-devkit/core';
import { chain, move, Rule, template, url } from '@angular-devkit/schematics';
import { createDatabaseCaches } from '@mountnotion/sdk';
import { RtkQueryOptions } from '@mountnotion/types';
import { applyWithOverwrite } from '../../rules';
import { validateInputs } from './validate-inputs';

export function rtkQuery(options: RtkQueryOptions): Rule {
  validateInputs(options);
  const { outDir, entities, baseUrl } = options;
  const excludes = options.excludes ?? [];
  return () => {
    const pageIds = [options.pageId].flat();
    return createDatabaseCaches(pageIds, options).then((caches) => {
      const includedCaches = caches.filter(
        ({ title }) => title && !excludes.includes(title)
      );
      const titles = includedCaches.map(({ title }) => title);
      const files = './files';

      const apisRules = includedCaches
        .filter(({ title }) => title !== options.usersDatabase)
        .map(({ title }) => {
          return applyWithOverwrite(url(`${files}/apis-all`), [
            template({
              title,
              entities,
              baseUrl,
              strategy: options.strategy,
              ...strings,
            }),
            move(`${outDir}/apis`),
          ]);
        });

      const apisIndexRule = options.strategy
        ? applyWithOverwrite(url(`${files}/apis-auth-index`), [
            template({
              titles,
              baseUrl,
              entities,
              strategy: options.strategy,
              userColumn: options.userColumn,
              usersDatabase: options.usersDatabase,
              ...strings,
            }),
            move(`${outDir}/apis`),
          ])
        : applyWithOverwrite(url(`${files}/apis-index`), [
            template({
              titles,
              baseUrl,
              entities,
              ...strings,
            }),
            move(`${outDir}/apis`),
          ]);

      const domainIndexRule = options.strategy
        ? applyWithOverwrite(url(`${files}/auth-index`), [
            template({
              entities,
              titles,
              userColumn: options.userColumn,
              usersDatabase: options.usersDatabase,
              ...strings,
            }),
            move(outDir),
          ])
        : applyWithOverwrite(url(`${files}/index`), [
            template({
              entities,
              titles,
              ...strings,
            }),
            move(outDir),
          ]);

      return chain([...apisRules, apisIndexRule, domainIndexRule]);
    });
  };
}
