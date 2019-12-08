import { WidgetNode } from '$:/core/modules/widgets/widget.js';
import { ParserOptions } from 'prettier';

interface ParserOptions {
  parseAsInline: string;
  _canonical_url?: string;
}

type Parser = (type: string, text: string, options: ParserOptions) => void;

type AudioFile = 'audio/ogg' | 'audio/mpeg' | 'audio/mp3' | 'audio/mp4';
type VideoFile = 'video/mp4' | 'video/quicktime';
type HTMLFile = 'text/html';
type PDFFile = 'application/pdf';
type CSVFile = 'text/csv';
type TextFile =
  | 'text/plain'
  | 'text/x-tiddlywiki'
  | 'application/javascript'
  | 'application/json'
  | 'text/css'
  | 'application/x-tiddler-dictionary';
type ImageFile =
  | 'image/svg+xml'
  | 'image/jpg'
  | 'image/jpeg'
  | 'image/png'
  | 'image/gif'
  | 'image/webp'
  | 'image/heic'
  | 'image/heif'
  | 'image/x-icon';

declare module '$:/core/modules/parsers/audioparser.js' {
  const exports: Record<AudioFile, Parser>;
  export = exports;
}

declare module '$:/core/modules/parsers/htmlparser.js' {
  const exports: Record<HTMLFile, Parser>;
  export = exports;
}

declare module '$:/core/modules/parsers/csvparser.js' {
  const exports: Record<CSVFile, Parser>;
  export = exports;
}

declare module '$:/core/modules/parsers/imageparser.js' {
  const exports: Record<ImageFile, Parser>;
  export = exports;
}

declare module '$:/core/modules/parsers/pdfparser.js' {
  const exports: Record<PDFFile, Parser>;
  export = exports;
}

declare module '$:/core/modules/parsers/textparser.js' {
  const exports: Record<TextFile, Parser>;
  export = exports;
}

declare module '$:/core/modules/parsers/videoparser.js' {
  const exports: Record<VideoFile, Parser>;
  export = exports;
}

declare module '$:/core/modules/parsers/wikiparser/wikiparser.js' {
  interface RuleResult {
    rule: string;
    matchIndex: number;
  }

  interface SkipWhitespaceOptions {
    treatNewlinesAsNonWhitespace: boolean;
  }

  interface ParseInlineRunOptions {
    eatTerminator?: boolean;
  }

  class TiddlyWikiParser {
    public loadRemoteTiddler(url: string): void;
    public setupRules(proto: object, configPrefix: string): void;
    public instantiateRules(
      classes: string[],
      type: string,
      startPos: number
    ): RuleResult[];
    public skipWhitespace(options: SkipWhitespaceOptions): void;
    public parsePragmas(): WidgetNode;
    public parseBlock(terminatorRegExp: RegExp): WidgetNode[];
    public parseBlocks(terminatorRegExp: RegExp): WidgetNode[];
    public parseBlocksUnterminated(): WidgetNode[];
    public parseBlocksTerminated(): WidgetNode[];
    public parseInlineRun(
      terminatorRegExpString: RegExp,
      options: ParseInlineRunOptions
    ): WidgetNode[];

    public parseInlineRunUnterminated(): WidgetNode[];
    public parseInlineRunTerminated(
      terminatorRegExp: RegExp,
      options: ParseInlineRunOptions
    ): WidgetNode[];

    public pushTextWidget(array: WidgetNode[], text: string): void;
    public parseClasses(): string[];
    public amendRules(type: 'only' | 'except', names: string[]): void;

    constructor(type: string, text: string, options: ParserOptions);
  }

  const exports: Record<'text/vnd.tiddlywiki', TiddlyWikiParser>;
  export = exports;
}

declare module '$:/core/modules/parsers/wikiparser/rules/wikirulebase.js' {
  export class WikiRuleBase {
    public(parser: Parser): void;
    public findNextMatch(start: number): number;
  }
}
