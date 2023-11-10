import {
  apply,
  forEach,
  mergeWith,
  Rule,
  SchematicContext,
  Source,
  Tree,
} from '@angular-devkit/schematics';
import { prettify } from '@mountnotion/utils';

export function applyWithoutOverwrite(source: Source, rules: Rule[]): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const rule = mergeWith(
      apply(source, [
        ...rules,
        forEach((fileEntry) => {
          if (tree.exists(fileEntry.path)) {
            return null;
          }
          return {
            path: fileEntry.path,
            content: Buffer.from(
              prettify(null, fileEntry.content.toString('utf-8'))
            ),
          };
        }),
      ])
    );

    return rule(tree, context);
  };
}
