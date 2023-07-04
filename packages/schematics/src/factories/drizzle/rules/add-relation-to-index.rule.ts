import { Rule, Tree } from '@angular-devkit/schematics';
import { InsertChange } from 'schematics-utilities';
import { addRelationToIndexChange } from '../utils/add-relation-to-index.change';

export function addRelationToIndexRule(relation: [string, string]): Rule {
  return (tree: Tree) => {
    const path = 'index.ts';

    const change = addRelationToIndexChange(path, relation, tree);
    const declarationRecorder = tree.beginUpdate(path);
    if (change instanceof InsertChange) {
      declarationRecorder.insertLeft(change.pos, change.toAdd);
    }
    tree.commitUpdate(declarationRecorder); // commits the update on the tree
    return tree;
  };
}
