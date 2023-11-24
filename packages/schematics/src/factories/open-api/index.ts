import { chain, move, Rule, template, url } from '@angular-devkit/schematics';
import { AuthOptions, BasicOptions } from '@mountnotion/types';
import { ensure, getSchema, log, strings } from '@mountnotion/utils';
import { applyWithOverwrite } from '../../rules';
import { validateAuthInputs, validateBasicInputs } from '../../utils';

export function openApi(options: BasicOptions & AuthOptions): Rule {
  log.success({ action: 'running', message: 'open api schematic' });
  log.success({ action: '-------', message: '------------------' });
  validateBasicInputs(options);
  validateAuthInputs(options);

  const outDir = options.outDir;
  const excludes = options.excludes ?? [];
  return async () => {
    const schema = ensure(getSchema());
    const includedSchema = schema.filter(
      ({ title }) => title && !excludes.includes(title)
    );
    const titles = includedSchema.map((schema) => schema.title);
    const controllersRules = includedSchema.map((schema) => {
      return applyWithOverwrite(url('./files/all'), [
        template({
          title: schema.title,
          schema,
          options,
          notionScheme: options.schema,
          strategies: options.strategies,
          userColumn: options.userColumn,
          usersDatabase: options.usersDatabase,
          log,
          ...strings,
        }),
        move(outDir),
      ]);
    });
    const controllersIndexRule = applyWithOverwrite(url('./files/index'), [
      template({
        titles,
        log,
        ...strings,
      }),
      move(outDir),
    ]);
    return chain([...controllersRules, controllersIndexRule]);
  };
}
