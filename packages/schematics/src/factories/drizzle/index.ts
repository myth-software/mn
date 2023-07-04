import { chain, move, Rule, template, url } from '@angular-devkit/schematics';
import { createDatabaseCaches } from '@mountnotion/sdk';
import { BasicOptions, Relations } from '@mountnotion/types';
import { ensure, logSuccess, strings } from '@mountnotion/utils';
import * as dotenv from 'dotenv';
import { rimraf } from 'rimraf';
import { applyWithOverwrite } from '../../rules';
import {
  addDevPackageToPackageJson,
  addPackageToPackageJson,
} from '../../utils';
import { addRelationToIndexRule } from './rules/add-relation-to-index.rule';
import { createRelationRule } from './rules/create-relation.rule';
import { prettifyIndexRule } from './rules/prettify-index.rule';
import { validateInputs } from './validate-inputs';

dotenv.config();
export function drizzle(options: BasicOptions): Rule {
  logSuccess({ action: 'running', message: 'drizzle schematic' });
  logSuccess({ action: '-------', message: '-----------------' });
  validateInputs(options);
  const { outDir } = options;
  const pageIds = [options.pageId].flat();
  const excludes = options.excludes ?? [];

  return async (tree) => {
    await rimraf(outDir);
    addPackageToPackageJson(tree, 'drizzle-orm', '0.27.0');
    addDevPackageToPackageJson(tree, 'drizzle-kit', '0.19.3');
    const caches = await createDatabaseCaches(pageIds, options);
    const includedCaches = caches.filter(
      ({ title }) => title && !excludes.includes(title)
    );
    const titles = includedCaches.map((cache) => cache.title);
    const drizzleRules = includedCaches.map((cache) => {
      return applyWithOverwrite(url('./files/schema'), [
        template({
          title: cache.title,
          cache,
          options,
          ...strings,
        }),
        move(`${outDir}/schema`),
      ]);
    });
    const drizzleIndexRule = applyWithOverwrite(url('./files/index'), [
      template({
        titles,
        ...strings,
      }),
      move(outDir),
    ]);

    const rules = [...drizzleRules, drizzleIndexRule];

    const newRelationRules = includedCaches
      .filter((cache) => cache.relations)
      .map((cache) => {
        return createRelationRule(options, cache);
      });

    rules.push(...newRelationRules);

    const uniqueRelations: Relations = includedCaches
      .filter((cache) => cache.relations)
      .reduce((acc, cache) => {
        const { title, relations } = cache;
        const orderedRelations = Object.values(ensure(relations)).reduce(
          (innerAcc, name) => {
            if (name > title) {
              return {
                ...innerAcc,
                [title]: name,
              };
            }
            return {
              ...innerAcc,
              [name]: title,
            };
          },
          acc
        );

        return {
          ...acc,
          ...orderedRelations,
        };
      }, {} as Record<string, string>);

    if (uniqueRelations) {
      Object.entries(uniqueRelations).forEach((relation) => {
        rules.push(addRelationToIndexRule(options, relation));
      });
    }

    rules.push(prettifyIndexRule(options));

    return chain(rules);
  };
}
