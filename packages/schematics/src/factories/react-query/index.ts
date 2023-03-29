import { strings } from '@angular-devkit/core';
import { chain, move, Rule, template, url } from '@angular-devkit/schematics';
import { createDatabaseCaches } from '@mountnotion/tools';
import { BasicOptions } from '@mountnotion/types';
import * as dotenv from 'dotenv';
import { applyWithOverwrite } from '../../rules';
import { validateBasicInputs } from '../../utils';

dotenv.config();

export function reactQuery(options: BasicOptions): Rule {
  validateBasicInputs(options);

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

      const infrastructuresRules = includedCaches.map(({ title }) => {
        return applyWithOverwrite(url(`${files}/infrastructure-all`), [
          template({
            title,
            entities,
            ...strings,
          }),
          move(`${outDir}/infrastructure`),
        ]);
      });

      const infrastructuresIndexRule = applyWithOverwrite(
        url(`${files}/infrastructure-index`),
        [
          template({
            titles,
            ...strings,
          }),
          move(`${outDir}/infrastructure`),
        ]
      );

      const infrastructuresInterfaceRule = applyWithOverwrite(
        url(`${files}/infrastructure-interface`),
        [move(`${outDir}/infrastructure`)]
      );

      const statesRules = includedCaches.map(({ title, icon }) => {
        return applyWithOverwrite(url(`${files}/+state-all`), [
          template({
            title,
            icon,
            entities,
            ...strings,
          }),
          move(`${outDir}/+state`),
        ]);
      });

      const statesIndexRule = applyWithOverwrite(url(`${files}/+state-index`), [
        template({
          titles,
          baseUrl,
          ...strings,
        }),
        move(`${outDir}/+state`),
      ]);

      const domainIndexRule = applyWithOverwrite(url(`${files}/index`), [
        move(outDir),
      ]);

      return chain([
        ...infrastructuresRules,
        infrastructuresInterfaceRule,
        infrastructuresIndexRule,
        ...statesRules,
        statesIndexRule,
        domainIndexRule,
      ]);
    });
  };
}
