import { Parser } from '../Parser';

declare module '$:/core/modules/parsers/wikiparser/rules/emphasis/bold.js' {
  export const name = 'bold';
  export const types: { inline: true };
  export function init(parser: Parser): void;
  export function parse(): WidgetNode[];
}

declare module '$:/core/modules/parsers/wikiparser/rules/emphasis/italic.js' {
  export const name = 'italic';
  export const types: { inline: true };
  export function init(parser: Parser): void;
  export function parse(): WidgetNode[];
}

declare module '$:/core/modules/parsers/wikiparser/rules/emphasis/strikethrough.js' {
  export const name = 'strikethrough';
  export const types: { inline: true };

  export function init(parser: Parser): void;
  export function parse(): WidgetNode[];
}

declare module '$:/core/modules/parsers/wikiparser/rules/emphasis/subscript.js' {
  export const name = 'subscript';
  export const types: { inline: true };

  export function init(parser: Parser): void;
  export function parse(): WidgetNode[];
}

declare module '$:/core/modules/parsers/wikiparser/rules/emphasis/superscript.js' {
  export const name = 'superscript';
  export const types: { inline: true };

  export function init(parser: Parser): void;
  export function parse(): WidgetNode[];
}

declare module '$:/core/modules/parsers/wikiparser/rules/emphasis/underscore.js' {
  export const name = 'underscore';
  export const types: { inline: true };

  export function init(parser: Parser): void;
  export function parse(): WidgetNode[];
}
