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

  // find the 'indicies' node by checking the SyntaxKind to be Identifier and by checking the node text to be 'indicies'
  const indiciesNode = nodes.find(
    (n) => n.kind === ts.SyntaxKind.Identifier && n.getText() === 'indicies'
  );
  if (!indiciesNode || !indiciesNode.parent) {
    throw new SchematicsException(`expected indicies variable in ${path}`);
  }

  // define indiciesNode's sibling nodes and remove indiciesNode from it
  let indiciesNodeSiblings = indiciesNode.parent.getChildren();
  const indiciesNodeIndex = indiciesNodeSiblings.indexOf(indiciesNode);
  indiciesNodeSiblings = indiciesNodeSiblings.slice(indiciesNodeIndex);

  // get indicies object literal expression from the siblings, this means this sign "{"
  const indiciesObjectLiteralExpressionNode = indiciesNodeSiblings.find(
    (n) => n.kind === ts.SyntaxKind.ObjectLiteralExpression
  );

  if (!indiciesObjectLiteralExpressionNode) {
    throw new SchematicsException(
      `indicies ObjectLiteralExpression node is not defined`
    );
  }

  // get indicies object list node which is in the children of indiciesObjectLiteralExpressionNode and its kind of SyntaxList
  const indiciesListNode = indiciesObjectLiteralExpressionNode
    .getChildren()
    .find((n) => n.kind === ts.SyntaxKind.SyntaxList);

  if (!indiciesListNode) {
    throw new SchematicsException(`indicies list node is not defined`);
  }
  console.log({ indiciesList: indiciesListNode.getText() });
  const manyToMany = `${relation[0]}To${classify(relation[1])}`;
  const indiciesToAdd = `${manyToMany}, ${manyToMany}Relations,`;

  // insert the new index to the end of the object (at the end of the indiciesListNode)
  return new InsertChange(path, indiciesListNode.getEnd(), indiciesToAdd);
}
