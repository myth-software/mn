import * as path from 'path';
import * as prettier from 'prettier';

const EXTENSION_TO_PARSER: Record<string, string> = {
  ts: 'typescript',
  tsx: 'typescript',
  js: 'babylon',
  jsx: 'babylon',
  'js.flow': 'flow',
  flow: 'flow',
  gql: 'graphql',
  graphql: 'graphql',
  css: 'postcss',
  scss: 'postcss',
  less: 'postcss',
  stylus: 'postcss',
  markdown: 'markdown',
  md: 'markdown',
  json: 'json',
};

export function prettify(filePath: string | null, content: string): string {
  const defaultConfig: prettier.Options = {
    bracketSpacing: true,
    singleQuote: true,
    printWidth: 80,
    trailingComma: 'all',
    arrowParens: 'avoid',
  };
  const resolvedConfig = prettier.resolveConfig.sync(process.cwd(), {
    useCache: true,
    editorconfig: true,
  });
  const config = resolvedConfig ?? defaultConfig;
  let parser = 'typescript';
  if (filePath) {
    const fileExtension = path.extname(filePath).slice(1);
    parser = EXTENSION_TO_PARSER[fileExtension];
  }
  const value = prettier.format(content, {
    parser,
    plugins: ['prettier-plugin-organize-imports'],
    ...config,
  });

  return value;
}
