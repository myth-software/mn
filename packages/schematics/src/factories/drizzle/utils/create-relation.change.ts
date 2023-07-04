import { SchematicsException, Tree } from '@angular-devkit/schematics';
import { Cache } from '@mountnotion/types';
import { camelize, classify, decamelize, ensure } from '@mountnotion/utils';
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

  // find the 'default' node by checking the SyntaxKind to be Identifier and by checking the node text to be 'default'
  const defaultNode = nodes.find(
    (n) => n.kind === ts.SyntaxKind.DefaultKeyword
  );
  if (!defaultNode || !defaultNode.parent) {
    throw new SchematicsException(`expected default variable in ${path}`);
  }

  const title = cache.title;
  const relations = Object.values(ensure(cache.relations)).map((name) => {
    if (name > title) {
      return `${camelize(title)}To${classify(name)}`;
    }
    return `${camelize(name)}To${classify(title)}`;
  });

  const innerRelations = relations.map((name) => `${name}: many(${name}),`);

  let relationsToCreate = '';

  relationsToCreate += `export const ${camelize(
    title
  )}Relations = relations(${camelize(title)}, ({ many }) => ({
    ${innerRelations.join(' ')}
  }));`;

  Object.values(ensure(cache.relations)).forEach((name) => {
    const relation =
      name > title
        ? `${camelize(title)}To${classify(name)}`
        : `${camelize(name)}To${classify(title)}`;
    if (!sourceText.includes(`export const ${relation}`)) {
      relationsToCreate += `export const ${relation} = pgTable('${decamelize(
        relation
      )}', {
          ${name}Id: integer('${name}_id').notNull().references(() => ${name}.id),
          ${title}Id: integer('${title}_id').notNull().references(() => ${title}.id),
        }, (t) => ({
          pk: primaryKey(t.${name}Id, t.${title}Id),
        }),
      );
      
      export const ${relation}Relations = relations(${relation}, ({ one }) => ({
        ${title}: one(${title}, {
          fields: [${relation}.${title}Id],
          references: [${title}.id],
        }),
        ${name}: one(${name}, {
          fields: [${relation}.${name}Id],
          references: [${name}.id],
        }),
      }));`;
    }
  });

  // insert the new index to the end of the object (at the end of the defaultListNode)
  return new InsertChange(
    path,
    defaultNode.parent.getStart(),
    relationsToCreate
  );
}
