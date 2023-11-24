import { chain, move, Rule, template, url } from '@angular-devkit/schematics';
import { FixturesOptions, Schema } from '@mountnotion/types';
import {
  ensure,
  getSchema,
  getTitleColumnFromSchema,
  log,
  strings,
} from '@mountnotion/utils';
import { rimraf } from 'rimraf';
import { applyWithOverwrite } from '../../rules';
import getFixtures from '../../utils/get-fixtures.util';

/**
 *
 * @returns rules for creating fixtures where the filename and related code does
 * not include '?', though 'title' strings do
 */
export function fixtures(options: FixturesOptions): Rule {
  log.success({ action: 'running', message: 'fixtures schematic' });
  log.success({ action: '-------', message: '----------------' });
  const outDir = options.outDir;
  const excludes = options.excludes ?? [];
  let schemaRef: Schema[] = [];
  let titlesRef: string[] = [];

  return async () => {
    await rimraf(outDir);
    const schema = ensure(getSchema());
    const includedSchema = schema.filter(
      ({ title }) => title && !excludes.includes(title)
    );
    schemaRef = includedSchema;
    const fixturesPromises = includedSchema.map((schema) =>
      getFixtures({ ...options, pageId: schema.id })
    );
    const fixturesResponse = await Promise.all(fixturesPromises);
    const rules = fixturesResponse
      .map(({ title, fixtures }) => {
        titlesRef = schemaRef.map((schema) => schema.title) as string[];
        const schema = schemaRef.find((schema) => schema.title === title);
        const TITLE = getTitleColumnFromSchema(schema as Schema);
        const fixturesRules = fixtures.map((fixture) => {
          const { [TITLE]: fixtureTitle } = fixture;
          const formattedTitle = strings.titlize(fixtureTitle);
          return applyWithOverwrite(url('./files/all-for-schema'), [
            template({
              title: formattedTitle,
              options,
              fixture,
              databaseName: title,
              log,
              ...strings,
            }),
            move(`${outDir}/${strings.dasherize(title)}`),
          ]);
        });

        const fixturesIndexRule = applyWithOverwrite(
          url('./files/index-for-schema'),
          [
            template({
              options,
              fixtures: fixtures.map((fixture) => ({
                ...fixture,
                title: strings.titlize(fixture[TITLE]),
              })),
              titles: titlesRef,
              log,
              databaseName: title,
              ...strings,
            }),
            move(`${outDir}/${strings.dasherize(title)}`),
          ]
        );

        return [...fixturesRules, fixturesIndexRule];
      })
      .flat();
    const fixturesRootIndexRule = applyWithOverwrite(url('./files/index'), [
      template({
        titles: titlesRef,
        options,
        log,
        ...strings,
      }),
      move(outDir),
    ]);
    return chain([...rules, fixturesRootIndexRule]);
  };
}
