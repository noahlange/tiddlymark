import { format } from 'prettier/standalone';

import html from 'prettier/parser-html';
import markdown from 'prettier/parser-markdown';
import babel from 'prettier/parser-babel';
import typescript from 'prettier/parser-typescript';
import postcss from 'prettier/parser-postcss';
import type { BuiltInParserName } from 'prettier';

const plugins = [markdown, postcss, babel, typescript, html];

function parserFor(type: string): BuiltInParserName | null {
  switch (type) {
    case 'text/html':
      return 'html';
    case 'text/x-markdown':
      return 'markdown';
    case 'application/typescript':
      return 'typescript';
    case 'application/javascript':
      return 'babel';
    case 'text/scss':
    case 'text/less':
    case 'text/css':
      return 'css';
  }
  return null;
}

function pretty(content: string, type: string): string {
  const parser = parserFor(type);
  return parser
    ? format(content, {
        parser,
        plugins
      })
    : content;
}

export function startup(): void {
  $tw.hooks.addHook(
    'th-saving-tiddler',
    (tiddler: Tiddler) =>
      new $tw.Tiddler(tiddler, {
        text: pretty(tiddler.fields.text, tiddler.fields.type)
      })
  );
}
