import { Rule, Tree } from '@angular-devkit/schematics';
import { BasicOptions } from '@mountnotion/types';
import { ensure, prettify } from '@mountnotion/utils';

export function prettifyRelationsRule(options: BasicOptions): Rule {
  return (tree: Tree) => {
    const path = `${options.outDir}/schema/relations.ts`;

    const declarationRecorder = tree.beginUpdate(path);

    declarationRecorder.insertLeft(
      0,
      `import { relations } from 'drizzle-orm';
      import { uuid, pgTable, primaryKey } from 'drizzle-orm/pg-core';`
    );

    tree.commitUpdate(declarationRecorder); // commits the update on the tree
    const text = tree.read(path);
    const content = Buffer.from(prettify(null, ensure(text).toString('utf-8')));
    tree.overwrite(path, content);
    return tree;
  };
}
