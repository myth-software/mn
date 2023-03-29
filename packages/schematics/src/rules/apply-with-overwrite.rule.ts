import {
  apply,
  forEach,
  mergeWith,
  Rule,
  SchematicContext,
  Source,
  Tree,
} from '@angular-devkit/schematics';
import { prettify } from '../utils';

export function applyWithOverwrite(source: Source, rules: Rule[]): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const rule = mergeWith(
      apply(source, [
        ...rules,
        forEach(fileEntry => {
          const prettifiedEntry = {
            path: fileEntry.path,
            content: Buffer.from(
              prettify(null, fileEntry.content.toString('utf-8')),
            ),
          };

          if (tree.exists(fileEntry.path)) {
            tree.overwrite(prettifiedEntry.path, prettifiedEntry.content);
            return null;
          }

          return prettifiedEntry;
        }),
      ]),
    );

    return rule(tree, context);
  };
}
