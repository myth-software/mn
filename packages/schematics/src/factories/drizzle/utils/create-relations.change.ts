import { SchematicsException, Tree } from '@angular-devkit/schematics';
import { Cache, DrizzleOptions } from '@mountnotion/types';
import { decamelize, log } from '@mountnotion/utils';
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { InsertChange } from 'schematics-utilities';
import { getRelations } from './relations.util';
export default function createRelationsChange(
  path: string,
  options: DrizzleOptions,
  caches: Cache[],
  tree: Tree
): InsertChange {
  if (options.debug) {
    log.debug({
      action: 'debugging',
      message: 'createRelationsChange',
    });
  }
  // reads the file from the tree
  const text = tree.read(path);
  // throw an error if the file doesn't exist
  if (!text) {
    throw new SchematicsException(`File does not exist.`);
  }

  const sourceText = text.toString('utf-8');
  // create the typescript source file
  const sourceFile = ts.createSourceFile(
    path,
    sourceText,
    ts.ScriptTarget.Latest,
    true
  );

  const relationsState = getRelations(caches, options);

  const relationsToCreate = relationsState.allIds.reduce((acc, curr) => {
    const relation = relationsState.byId[curr];
    return (acc += `
    export const ${relation.constName} = pgTable('${relation.tableName}', {
      ${relation.firstId}: uuid('${decamelize(
      relation.firstId
    )}').notNull().references(() => ${relation.firstName}.id, {
        onDelete: 'set null',
        onUpdate: 'cascade',
      }),
      ${relation.secondId}: uuid('${decamelize(
      relation.secondId
    )}').notNull().references(() => ${relation.secondName}.id, {
        onDelete: 'set null',
        onUpdate: 'cascade',
      }),
    }, (table) => ({
      pk: primaryKey({
        columns: [table.${relation.firstId}, table.${relation.secondId}]
      }),
    }),
  );
  
  `);
  }, '');

  if (options.debug) {
    log.debug({
      action: 'debugging',
      message: 'relations to create text: ',
    });
    console.info(relationsToCreate);
  }

  // insert the new index to the end of the object (at the end of the source file)
  return new InsertChange(path, sourceFile.getEnd(), relationsToCreate);
}
