import { chain, move, Rule, template, url } from '@angular-devkit/schematics';
import { BasicOptions } from '@mountnotion/types';
import { ensure, getSchema, log, strings } from '@mountnotion/utils';
import { addPackageToPackageJson } from 'schematics-utilities';
import { applyWithOverwrite } from '../../rules';
import addRelationsToSchemaRule from '../../rules/add-relations-to-schema.rule';
import { addDevPackageToPackageJson } from '../../utils';
import { validateInputs } from './validate-inputs';

export function schema(options: BasicOptions): Rule {
  log.success({ action: 'running', message: 'schema schematic' });
  log.success({ action: '-------', message: '-------------' });
  validateInputs(options);
  const excludes = options.excludes ?? [];
  const outDir = options.outDir;

  return async (tree) => {
    addPackageToPackageJson(tree, 'drizzle-orm', '0.29.0');
    addDevPackageToPackageJson(tree, 'drizzle-kit', '0.20.2');
    const schema = ensure(getSchema());
    const includedSchema = schema.filter(
      ({ title }) => title && !excludes.includes(title)
    );

    const drizzleRule = applyWithOverwrite(url('./files/drizzle'), [
      template({
        log,
        options,
        schema: includedSchema,
        ...strings,
      }),
      move(outDir),
    ]);
    const notionRule = applyWithOverwrite(url('./files/notion'), [
      template({
        log,
        options,
        schema: includedSchema,
        ...strings,
      }),
      move(outDir),
    ]);
    const indexRule = applyWithOverwrite(url('./files/index'), [
      template({
        log,
        options,
        schema: includedSchema,
        ...strings,
      }),
      move(outDir),
    ]);
    return chain([
      drizzleRule,
      notionRule,
      indexRule,
      addRelationsToSchemaRule(options, includedSchema),
    ]);
  };
}
