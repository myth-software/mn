import { chain, move, Rule, template, url } from '@angular-devkit/schematics';
import { createDatabaseCaches } from '@mountnotion/sdk';
import { MockApiOptions } from '@mountnotion/types';
import { strings } from '@mountnotion/utils';
import * as dotenv from 'dotenv';
import { applyWithOverwrite } from '../../rules';
import { validateAuthInputs, validateBasicInputs } from '../../utils';
dotenv.config();

export function mockApi(options: MockApiOptions): Rule {
  validateBasicInputs(options);
  validateAuthInputs(options);

  const { outDir, entities, baseUrl, usersDatabase, locals } = options;
  const excludes = options.excludes ?? [];
  return () => {
    const pageIds = [options.pageId].flat();
    return createDatabaseCaches(pageIds, options).then((caches) => {
      const includedCaches = caches.filter(
        ({ title }) => title && !excludes.includes(title)
      );
      const titles = includedCaches.map(({ title }) => title);
      const files = './files';

      const endpointsRules = includedCaches.map(({ title }) => {
        return applyWithOverwrite(url(`${files}/endpoints-all`), [
          template({
            title,
            entities,
            baseUrl,
            locals,
            ...strings,
          }),
          move(`${outDir}/endpoints`),
        ]);
      });

      const endpointsIndexRule = options.strategy
        ? applyWithOverwrite(url(`${files}/endpoints-auth-index`), [
            template({
              titles,
              entities,
              baseUrl,
              locals,
              usersDatabase,
              ...strings,
            }),
            move(`${outDir}/endpoints`),
          ])
        : applyWithOverwrite(url(`${files}/endpoints-index`), [
            template({
              titles,
              entities,
              baseUrl,
              locals,
              ...strings,
            }),
            move(`${outDir}/endpoints`),
          ]);

      const modelsRules = includedCaches.map(({ title }) => {
        return applyWithOverwrite(url(`${files}/models-all`), [
          template({
            title,
            entities,
            baseUrl,
            locals,
            ...strings,
          }),
          move(`${outDir}/models`),
        ]);
      });

      const modelsIndexRule = applyWithOverwrite(url(`${files}/models-index`), [
        template({
          titles,
          entities,
          baseUrl,
          locals,
          ...strings,
        }),
        move(`${outDir}/models`),
      ]);

      const indexRule = applyWithOverwrite(url(`${files}/index`), [
        template({
          titles,
          entities,
          baseUrl,
          locals,
          ...strings,
        }),
        move(outDir),
      ]);

      return chain([
        ...endpointsRules,
        endpointsIndexRule,
        ...modelsRules,
        modelsIndexRule,
        indexRule,
      ]);
    });
  };
}
