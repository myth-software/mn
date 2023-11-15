import { Rule, Tree } from '@angular-devkit/schematics';
import { DrizzleOptions, FlatDatabase } from '@mountnotion/types';
import { ensure, log, prettify } from '@mountnotion/utils';
import createRelationsChange from '../utils/create-relations.change';

export default function addRelationsToSchemaRule(
  options: DrizzleOptions,
  caches: FlatDatabase[]
): Rule {
  return (tree: Tree) => {
    if (options.debug) {
      log.debug({
        action: 'debugging',
        message: 'addRelationsToSchemaRule',
      });
    }
    const path = `${options.outDir}/drizzle.schema.ts`;

    const change = createRelationsChange(path, options, caches, tree);
    const declarationRecorder = tree.beginUpdate(path);

    // add missing imports
    declarationRecorder.insertLeft(
      0,
      `import { uuid, pgTable, primaryKey } from 'drizzle-orm/pg-core';`
    );

    declarationRecorder.insertLeft(change.pos, change.toAdd);
    tree.commitUpdate(declarationRecorder); // commits the update on the tree

    // prettifies the output
    const text = tree.read(path);
    if (options.debug) {
      log.debug({
        action: 'debugging',
        message: 'addRelationsToSchemaRule',
      });
      console.info(text);
    }
    const content = Buffer.from(prettify(null, ensure(text).toString('utf-8')));
    tree.overwrite(path, content);
    return tree;
  };
}
