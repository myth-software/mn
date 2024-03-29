import { chain, move, Rule, template, url } from '@angular-devkit/schematics';
import { MirageOptions } from '@mountnotion/types';
import { ensure, getSchema, log, strings } from '@mountnotion/utils';
import { applyWithOverwrite } from '../../rules';
import { validateInputs } from './validate-inputs';

export function mirage(options: MirageOptions): Rule {
  log.success({ action: 'running', message: 'mirage schematic' });
  log.success({ action: '-------', message: '----------------' });
  validateInputs(options);

  const outDir = options.outDir;
  const excludes = options.excludes ?? [];
  return async () => {
    const schema = ensure(getSchema());
    const includedSchema = schema.filter(
      ({ title }) => title && !excludes.includes(title)
    );
    const titles = includedSchema.map((schema) => schema.title);
    const files = './files';
    const endpointsRules = includedSchema.map((schema) => {
      return applyWithOverwrite(url(`${files}/endpoints-all`), [
        template({
          title: schema.title,
          schema,
          options,
          log,
          ...strings,
        }),
        move(`${outDir}/endpoints`),
      ]);
    });
    const endpointsIndexRule = options.strategies
      ? applyWithOverwrite(url(`${files}/endpoints-auth-index`), [
          template({
            titles,
            options,
            log,
            ...strings,
          }),
          move(`${outDir}/endpoints`),
        ])
      : applyWithOverwrite(url(`${files}/endpoints-index`), [
          template({
            titles,
            options,
            log,
            ...strings,
          }),
          move(`${outDir}/endpoints`),
        ]);
    const modelsRules = includedSchema.map((schema) => {
      return applyWithOverwrite(url(`${files}/models-all`), [
        template({
          title: schema.title,
          options,
          log,
          ...strings,
        }),
        move(`${outDir}/models`),
      ]);
    });
    const modelsIndexRule = applyWithOverwrite(url(`${files}/models-index`), [
      template({
        titles,
        options,
        log,
        ...strings,
      }),
      move(`${outDir}/models`),
    ]);
    const indexRule = applyWithOverwrite(url(`${files}/index`), [
      template({
        titles,
        options,
        log,
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
  };
}
