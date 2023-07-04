import { SchematicsException, Tree } from '@angular-devkit/schematics';
import { classify } from '@mountnotion/utils';
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { Change, getSourceNodes, InsertChange } from 'schematics-utilities';
export function addRelationToIndexChange(
  path: string,
  relation: [string, string],
  tree: Tree
): Change {
  // reads the index.js file from the tree
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

  // get the nodes of the source file
  const nodes = getSourceNodes(sourceFile);

  // find the 'default' node by checking the SyntaxKind to be Identifier and by checking the node text to be 'default'
  const defaultNode = nodes.find(
    (n) => n.kind === ts.SyntaxKind.Identifier && n.getText() === 'default'
  );
  if (!defaultNode || !defaultNode.parent) {
    throw new SchematicsException(`expected default variable in ${path}`);
  }

  // define defaultNode's sibling nodes and remove defaultNode from it
  let defaultNodeSiblings = defaultNode.parent.getChildren();
  const defaultNodeIndex = defaultNodeSiblings.indexOf(defaultNode);
  defaultNodeSiblings = defaultNodeSiblings.slice(defaultNodeIndex);

  // get default object literal expression from the siblings, this means this sign "{"
  const defaultObjectLiteralExpressionNode = defaultNodeSiblings.find(
    (n) => n.kind === ts.SyntaxKind.ObjectLiteralExpression
  );

  if (!defaultObjectLiteralExpressionNode) {
    throw new SchematicsException(
      `default ObjectLiteralExpression node is not defined`
    );
  }

  // get default object list node which is in the children of defaultObjectLiteralExpressionNode and its kind of SyntaxList
  const defaultListNode = defaultObjectLiteralExpressionNode
    .getChildren()
    .find((n) => n.kind === ts.SyntaxKind.SyntaxList);

  if (!defaultListNode) {
    throw new SchematicsException(`default list node is not defined`);
  }
  const defaultListText = defaultListNode.getText();
  const firstRelation = `${relation[0]}Relations`;
  const secondRelation = `${relation[1]}Relations`;
  const manyToMany = `${relation[0]}To${classify(relation[1])}`;
  let defaultToAdd = '';
  if (!defaultListText.endsWith(',')) {
    defaultToAdd = ', ';
  }
  if (!defaultListText.includes(firstRelation)) {
    defaultToAdd += `${firstRelation}, `;
  }
  if (!defaultListText.includes(secondRelation)) {
    defaultToAdd += `${secondRelation}, `;
  }
  defaultToAdd = defaultToAdd + `${manyToMany}, ${manyToMany}Relations,`;

  // insert the new index to the end of the object (at the end of the defaultListNode)
  return new InsertChange(path, defaultListNode.getEnd(), defaultToAdd);
}
