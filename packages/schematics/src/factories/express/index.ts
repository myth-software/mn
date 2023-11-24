import { chain, move, Rule, template, url } from '@angular-devkit/schematics';
import { ExpressOptions } from '@mountnotion/types';
import { ensure, getSchema, log, strings } from '@mountnotion/utils';
import { applyWithoutOverwrite, applyWithOverwrite } from '../../rules';
import { addPackageToPackageJson } from '../../utils';
import { validateInputs } from './validate-inputs';

export function express(options: ExpressOptions): Rule {
  log.success({ action: 'running', message: 'express schematic' });
  log.success({ action: '-------', message: '-----------------' });
  validateInputs(options);

  const outDir = options.outDir;
  const excludes = options.excludes ?? [];
  return async (tree) => {
    addPackageToPackageJson(tree, 'helmet', '7.0.0');
    addPackageToPackageJson(tree, 'cors', '2.8.5');

    const schema = ensure(getSchema());
    const includedSchema = schema.filter(
      ({ title }) => title && !excludes.includes(title)
    );
    const titles = includedSchema.map((schema) => schema.title);
    const routerRules = includedSchema.map((schema) => {
      return applyWithoutOverwrite(url('./files/routers'), [
        template({
          title: schema.title,
          schema,
          options,
          log,
          ...strings,
        }),
        move(`${outDir}/routers`),
      ]);
    });
    const actionRouterRules = options.actionRouter
      ? includedSchema.map((schema) => {
          return applyWithoutOverwrite(url('./files/routers-action'), [
            template({
              title: schema.title,
              schema,
              options,
              log,
              ...strings,
            }),
            move(`${outDir}/routers`),
          ]);
        })
      : [];
    const controllerRules = includedSchema.map((schema) => {
      return options.eject
        ? applyWithOverwrite(url('./files/controllers-eject'), [
            template({
              title: schema.title,
              schema,
              options,
              log,
              ...strings,
            }),
            move(`${outDir}/controllers`),
          ])
        : applyWithoutOverwrite(url('./files/controllers'), [
            template({
              title: schema.title,
              schema,
              options,
              log,
              ...strings,
            }),
            move(`${outDir}/controllers`),
          ]);
    });
    const middlewareRule = applyWithoutOverwrite(url('./files/middleware'), [
      template({
        titles,
        options,
        log,
        ...strings,
      }),
      move(`${outDir}/middleware`),
    ]);
    const expressIndexRule = applyWithoutOverwrite(url('./files/index'), [
      template({
        titles,
        options,
        log,
        ...strings,
      }),
      move(outDir),
    ]);
    return chain([
      ...routerRules,
      ...actionRouterRules,
      ...controllerRules,
      middlewareRule,
      expressIndexRule,
    ]);
  };
}
