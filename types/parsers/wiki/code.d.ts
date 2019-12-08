import { Parser } from '../Parser';

declare module '$:/core/modules/parsers/wikiparser/rules/codeblock.js' {
  export const name = 'codeblock';
  export const types: { block: true };
  export function init(parser: Parser): void;
  export function parse(): WidgetNode[];
}
declare module '$:/core/modules/parsers/wikiparser/rules/codeinline.js' {
  export const name = 'codeinline';
  export const types: { block: false };
  export function init(parser: Parser): void;
  export function parse(): WidgetNode[];
}
