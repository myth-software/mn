import { chain, move, Rule, template, url } from '@angular-devkit/schematics';
import { BasicOptions } from '@mountnotion/types';
import { ensure, getSchema, log, strings } from '@mountnotion/utils';
import { applyWithOverwrite } from '../../rules';
import { validateBasicInputs } from '../../utils';

export function reactQuery(options: BasicOptions): Rule {
  log.success({ action: 'running', message: 'react query schematic' });
  log.success({ action: '-------', message: '---------------------' });
  validateBasicInputs(options);

  const outDir = options.outDir;
  const excludes = options.excludes ?? [];
  return async () => {
    const schema = ensure(getSchema());
    const includedSchema = schema.filter(
      (schema) => schema.title && !excludes.includes(schema.title)
    );
    const titles = includedSchema.map((schema_1) => schema_1.title);
    const files = './files';
    const infrastructuresRules = includedSchema.map((schema) => {
      return applyWithOverwrite(url(`${files}/infrastructure-all`), [
        template({
          title: schema.title,
          schema,
          options,
          log,
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
          log,
          ...strings,
        }),
        move(`${outDir}/infrastructure`),
      ]
    );
    const infrastructuresInterfaceRule = applyWithOverwrite(
      url(`${files}/infrastructure-interface`),
      [move(`${outDir}/infrastructure`)]
    );
    const statesRules = includedSchema.map((schema) => {
      return applyWithOverwrite(url(`${files}/+state-all`), [
        template({
          title: schema.title,
          schema,
          options,
          log,
          ...strings,
        }),
        move(`${outDir}/+state`),
      ]);
    });
    const statesIndexRule = applyWithOverwrite(url(`${files}/+state-index`), [
      template({
        titles,
        options,
        log,
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
  };
}
