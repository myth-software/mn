import { SchematicsException, Tree } from '@angular-devkit/schematics';
import { Cache } from '@mountnotion/types';
import { camelize, classify, ensure } from '@mountnotion/utils';
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { Change, getSourceNodes, InsertChange } from 'schematics-utilities';
export function createRelationChange(
  path: string,
  cache: Cache,
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

  const title = cache.title;
  const relations = Object.values(ensure(cache.relations))
    .map((name) => {
      if (name > title) {
        return `${camelize(title)}To${classify(name)}`;
      }
      return `${camelize(name)}To${classify(title)}`;
    })
    .map((name) => `${name}: many(${name}),`);

  const relationToCreate = `export const ${camelize(
    title
  )}Relations = relations(${camelize(title)}, ({ many }) => ({
    ${relations.join(' ')}
  }));`;

  // insert the new index to the end of the object (at the end of the indiciesListNode)
  return new InsertChange(
    path,
    indiciesNode.parent.parent.parent.getStart(),
    relationToCreate
  );
}
