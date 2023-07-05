import { chain, move, Rule, template, url } from '@angular-devkit/schematics';
import { createDatabaseCaches } from '@mountnotion/sdk';
import { ExpressOptions } from '@mountnotion/types';
import { log, strings } from '@mountnotion/utils';
import { rimraf } from 'rimraf';
import { applyWithOverwrite } from '../../rules';
import { addPackageToPackageJson } from '../../utils';
import { validateInputs } from './validate-inputs';

export function express(options: ExpressOptions): Rule {
  log.success({ action: 'running', message: 'express schematic' });
  log.success({ action: '-------', message: '-----------------' });
  validateInputs(options);

  const outDir = options.outDir;
  const pageIds = [options.pageId].flat();
  const excludes = options.excludes ?? [];
  return async (tree) => {
    await rimraf(outDir);
    addPackageToPackageJson(tree, 'helmet', '7.0.0');
    addPackageToPackageJson(tree, 'cors', '2.8.5');
    const caches = await createDatabaseCaches(pageIds, options);
    const includedCaches = caches.filter(
      ({ title }) => title && !excludes.includes(title)
    );
    const titles = includedCaches.map((cache) => cache.title);
    const expressRules = includedCaches.map((cache) => {
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
    const expressIndexRule = applyWithOverwrite(url('./files/index'), [
      template({
        titles,
        options,
        log,
        ...strings,
      }),
      move(outDir),
    ]);
    return chain([...expressRules, expressIndexRule]);
  };
}
