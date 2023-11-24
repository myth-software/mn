import { chain, move, Rule, template, url } from '@angular-devkit/schematics';
import { RtkQueryOptions } from '@mountnotion/types';
import { ensure, getSchema, log, strings } from '@mountnotion/utils';
import { applyWithOverwrite } from '../../rules';
import { validateInputs } from './validate-inputs';

export function rtkQuery(options: RtkQueryOptions): Rule {
  log.success({ action: 'running', message: 'rtk query schematic' });
  log.success({ action: '-------', message: '-------------------' });
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
    const apisRules = includedSchema
      .filter((schema) => schema.title !== options.usersDatabase)
      .map((schema) => {
        return applyWithOverwrite(url(`${files}/apis-all`), [
          template({
            title: schema.title,
            schema,
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
            options,
            ...strings,
          }),
          move(`${outDir}/apis`),
        ])
      : applyWithOverwrite(url(`${files}/apis-index`), [
          template({
            titles,
            log,
            options,
            ...strings,
          }),
          move(`${outDir}/apis`),
        ]);
    const domainIndexRule = options.strategies
      ? applyWithOverwrite(url(`${files}/auth-index`), [
          template({
            titles,
            log,
            options,
            ...strings,
          }),
          move(outDir),
        ])
      : applyWithOverwrite(url(`${files}/index`), [
          template({
            titles,
            log,
            options,
            ...strings,
          }),
          move(outDir),
        ]);
    return chain([...apisRules, apisIndexRule, domainIndexRule]);
  };
}
