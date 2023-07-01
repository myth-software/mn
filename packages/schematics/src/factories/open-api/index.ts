import { chain, move, Rule, template, url } from '@angular-devkit/schematics';
import { createDatabaseCaches } from '@mountnotion/sdk';
import { AuthOptions, BasicOptions } from '@mountnotion/types';
import { logSuccess, strings } from '@mountnotion/utils';
import { applyWithOverwrite } from '../../rules';
import { validateAuthInputs, validateBasicInputs } from '../../utils';

export function openApi(options: BasicOptions & AuthOptions): Rule {
  logSuccess({ action: 'running', message: 'open api schematic' });
  logSuccess({ action: '-------', message: '------------------' });
  validateBasicInputs(options);
  validateAuthInputs(options);

  const outDir = options.outDir;
  const pageIds = [options.pageId].flat();
  const excludes = options.excludes ?? [];
  return () => {
    return createDatabaseCaches(pageIds, options).then((caches) => {
      const includedCaches = caches.filter(
        ({ title }) => title && !excludes.includes(title)
      );
      const titles = includedCaches.map(({ title }) => title);
      const controllersRules = includedCaches.map((index) => {
        const { title } = index;

        return applyWithOverwrite(url('./files/all'), [
          template({
            title,
            index,
            entities: options.entities,
            strategies: options.strategies,
            userColumn: options.userColumn,
            usersDatabase: options.usersDatabase,
            ...strings,
          }),
          move(outDir),
        ]);
      });

      const controllersIndexRule = applyWithOverwrite(url('./files/index'), [
        template({
          titles,
          ...strings,
        }),
        move(outDir),
      ]);

      return chain([...controllersRules, controllersIndexRule]);
    });
  };
}
