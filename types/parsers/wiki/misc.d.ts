import { Parser } from '../Parser';

declare module '$:/core/modules/parsers/wikiparser/rules/dash.js' {
  export const name: 'dash';
  export const types: { inline: true };
  export function init(parser: Parser): void;
  export function parse(): WidgetNode[];
}

declare module '$:/core/modules/parsers/wikiparser/rules/entity.js' {
  export const name: 'entity';
  export const types: { inline: true };
  export function init(parser: Parser): void;
  export function parse(): WidgetNode[];
}

declare module '$:/core/modules/parsers/wikiparser/rules/extlink.js' {
  export const name: 'extlink';
  export const types: { inline: true };
  export function init(parser: Parser): void;
  export function parse(): WidgetNode[];
}

declare module '$:/core/modules/parsers/wikiparser/rules/hardlinebreaks.js' {
  export const name: 'hardlinebreaks';
  export const types: { inline: true };
  export function init(parser: Parser): void;
  export function parse(): WidgetNode[];
}

declare module '$:/core/modules/parsers/wikiparser/rules/heading.js' {
  export const name: 'heading';
  export const types: { block: true };
  export function init(parser: Parser): void;
  export function parse(): WidgetNode[];
}

declare module '$:/core/modules/parsers/wikiparser/rules/horizrule.js' {
  export const name: 'horizrule';
  export const types: { block: true };
  export function init(parser: Parser): void;
  export function parse(): WidgetNode[];
}

declare module '$:/core/modules/parsers/wikiparser/rules/html.js' {
  interface ParseTagOptions {
    requireLineBreak?: boolean;
  }

  export const name: 'html';
  export const types: { inline: true; block: true };
  export function init(parser: Parser): void;
  export function findNextMatch(startPos: number): WidgetNode;
  export function parse(): WidgetNode[];
  export function isLegalTag(tag: WidgetNode): boolean;

  export function findNextTag(
    source: string,
    pos: number,
    options: ParseTagOptions
  ): WidgetNode | null;

  export function parseTag(
    source: string,
    pos: number,
    options?: ParseTagOptions
  ): WidgetNode | null;
}

declare module '$:/core/modules/parsers/wikiparser/rules/image.js' {
  export const name: 'image';
  export const types: { line: true };
  export function init(parser: Parser): void;
  export function findNextMatch(startPos: number): WidgetNode;
  export function findNextImage(source: string, pos: number): WidgetNode | null;
  export function parseImage(source: string, pos: number): WidgetNode | null;
  export function parse(): WidgetNode[];
}
