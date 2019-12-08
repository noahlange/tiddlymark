import { Parser } from '../Parser';

declare module '$:/core/modules/parsers/wikiparser/rules/commentblock.js' {
  export const name = 'commentblock';
  export const types: { block: true };
  export function init(parser: Parser): void;
  export function findNextMatch(startPos: number): number | undefined;
  export function parse(): WidgetNode[];
}

declare module '$:/core/modules/parsers/wikiparser/rules/commentinline.js' {
  export const name = 'commentinline';
  export const types: { block: false };
  export function init(parser: Parser): void;
  export function findNextMatch(startPos: number): number | undefined;
  export function parse(): WidgetNode[];
}
