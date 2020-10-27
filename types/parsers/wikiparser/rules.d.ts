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

declare module '$:/core/modules/parsers/wikiparser/rules/image.js' {
  export const name: 'image';
  export const types: { line: true };
  export function init(parser: Parser): void;
  export function findNextMatch(startPos: number): WidgetNode;
  export function findNextImage(source: string, pos: number): WidgetNode | null;
  export function parseImage(source: string, pos: number): WidgetNode | null;
  export function parse(): WidgetNode[];
}

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
