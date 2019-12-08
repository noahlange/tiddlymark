import { Parser } from '../Parser';

declare module '$:/core/modules/parsers/wikiparser/rules/filteredtranscludeblock.js' {
  export const name = 'filteredtranscludeblock';
  export const types: { block: true };
  export function init(parser: Parser): void;
  export function parse(): WidgetNode[];
}

declare module '$:/core/modules/parsers/wikiparser/rules/filteredtranscludeinline.js' {
  export const name = 'filteredtranscludeinline';
  export const types: { inline: true };
  export function init(parser: Parser): void;
  export function parse(): WidgetNode[];
}

declare module '$:/core/modules/parsers/wikiparser/rules/transcludeblock.js' {
  export const name = 'transcludeblock';
  export const types: { block: true };
  export function init(parser: Parser): void;
  export function parse(): WidgetNode[];
}

declare module '$:/core/modules/parsers/wikiparser/rules/transclusioninline.js' {
  export const name = 'transcludeinline';
  export const types: { inline: true };
  export function init(parser: Parser): void;
  export function parse(): WidgetNode[];
}
