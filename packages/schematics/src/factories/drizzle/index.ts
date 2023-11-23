import { chain, move, Rule, template, url } from '@angular-devkit/schematics';
import { DrizzleOptions } from '@mountnotion/types';
import { ensure, getCache, log, strings } from '@mountnotion/utils';
import { applyWithOverwrite } from '../../rules';
import {
  addDevPackageToPackageJson,
  addPackageToPackageJson,
} from '../../utils';
import addRelationsToSchemaRule from './rules/add-relations-to-schema.rule';
import { validateInputs } from './validate-inputs';
import path = require('path');

export function drizzle(options: DrizzleOptions): Rule {
  log.success({ action: 'running', message: 'drizzle schematic' });
  log.success({ action: '-------', message: '-----------------' });
  validateInputs(options);
  const excludes = options.excludes ?? [];
  const outDir = path.resolve(process.cwd(), options.outDir);

  return async (tree) => {
    addPackageToPackageJson(tree, 'drizzle-orm', '0.29.0');
    addDevPackageToPackageJson(tree, 'drizzle-kit', '0.20.2');
    const c = ensure(getCache());
    const includedCaches = c.filter(
      (cache) => cache.title && !excludes.includes(cache.title)
    );

    const drizzleIndexRule = applyWithOverwrite(url('./files/index'), [
      template({
        log,
        options,
        caches: includedCaches,
        ...strings,
      }),
      move(outDir),
    ]);

    return chain([
      drizzleIndexRule,
      addRelationsToSchemaRule(options, includedCaches),
    ]);
  };
}
