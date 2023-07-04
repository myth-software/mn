import { Rule, Tree } from '@angular-devkit/schematics';
import { BasicOptions, Cache } from '@mountnotion/types';
import { InsertChange } from 'schematics-utilities';
import { createRelationChange } from '../utils/create-relation.change';

export function createRelationRule(options: BasicOptions, cache: Cache): Rule {
  return (tree: Tree) => {
    const path = `${options.outDir}/schema/relations.ts`;

    const change = createRelationChange(path, cache, tree);
    const declarationRecorder = tree.beginUpdate(path);
    if (change instanceof InsertChange) {
      declarationRecorder.insertLeft(change.pos, change.toAdd);
    }
    tree.commitUpdate(declarationRecorder); // commits the update on the tree
    return tree;
  };
}
