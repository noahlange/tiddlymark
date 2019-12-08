/// <reference path="../../node_modules/@types/react/index.d.ts" />

declare module 'simple-markdown' {
  import { ReactNode } from 'react';
  type ReactElement = JSX.Element;
  type ReactElements = ReactNode;

  type Capture = string[] & { index?: number };
  type Attr = string | number | boolean;
  export type SingleASTNode<T, K extends keyof T = keyof T> = Record<K, T[K]>;
  type UnTypedASTNode = Record<string, any>;
  type ASTNode<T> = SingleASTNode<T> | SingleASTNode<T>[];

  export type State = Record<string, any>;

  export type MatchFunction = (
    source: string,
    state: State,
    prevCapture: string
  ) => Capture | void;

  type Parser = (source: string, state?: State) => ASTNode;

  type ParseFunction = (
    capture: Capture,
    nestedParse: Parser,
    state: State
  ) => UnTypedASTNode | ASTNode;

  type SingleNodeParseFunction = (
    capture: Capture,
    nestedParse: Parser,
    state: State
  ) => UnTypedASTNode;

  type Output<T> = (node: ASTNode, state?: State) => T;

  type NodeOutput<T> = (
    node: SingleASTNode<T>,
    output: Output<T>,
    state: State
  ) => T;

  type ArrayRule = {
    [key: string]: ArrayNodeOutput<any>;
  };

  type ReactOutput = Output<ReactElements>;
  type ReactNodeOutput = NodeOutput<ReactElements>;

  type ArrayNodeOutput<T> = (
    node: Array<SingleASTNode>,
    nestedOutput: Output<T>,
    state: State
  ) => T;

  type ParserRule = {
    order: number;
    match: MatchFunction;
    quality?: (capture: Capture, state: State, prevCapture: string) => number;
    parse: ParseFunction;
  };

  type SingleNodeParserRule = {
    order: number;
    match: MatchFunction;
    quality?: (capture: Capture, state: State, prevCapture: string) => number;
    parse: SingleNodeParseFunction;
  };

  type Rule = ArrayRule | ParserRule | undefined;
  type HtmlOutput = Output<string>;
  type HtmlNodeOutput = NodeOutput<string>;

  type ReactOutputRule = {
    // we allow null because some rules are never output results, and that's
    // legal as long as no parsers return an AST node matching that rule.
    // We don't use ? because this makes it be explicitly defined as either
    // a valid function or null, so it can't be forgotten.
    react: ReactNodeOutput | null;
  };

  export type ParserRules = {
    Array?: Rule;
    [key: string]: Rule;
  };

  type OutputRules<T, K extends keyof T = keyof T> = {
    Array?: Rule;
  } & Record<K, T[K]>;

  type HtmlOutputRule = {
    html: HtmlNodeOutput | null;
  };

  type TextReactOutputRule = {
    react: NodeOutput<string>;
  };

  type HtmlRules = Record<string, ParserRule & HtmlOutputRule> &
    Record<'html', ArrayNodeOutput<string>>;

  type NonNullHtmlOutputRule = {
    html: HtmlNodeOutput;
  };

  type NonNullReactOutputRule = {
    react: ReactNodeOutput;
  };
  type ElementReactOutputRule = {
    react: NodeOutput<ReactElement>;
  };

  type DefaultInRule = SingleNodeParserRule & ReactOutputRule & HtmlOutputRule;
  type TextInOutRule = SingleNodeParserRule &
    TextReactOutputRule &
    NonNullHtmlOutputRule;
  type LenientInOutRule = SingleNodeParserRule &
    NonNullReactOutputRule &
    NonNullHtmlOutputRule;
  type DefaultInOutRule = SingleNodeParserRule &
    ElementReactOutputRule &
    NonNullHtmlOutputRule;

  type DefaultRules = {
    Array: {
      react: ArrayNodeOutput<ReactElements>;
      html: ArrayNodeOutput<string>;
    };
    heading: DefaultInOutRule;
    nptable: DefaultInRule;
    lheading: DefaultInRule;
    hr: DefaultInOutRule;
    codeBlock: DefaultInOutRule;
    fence: DefaultInRule;
    blockQuote: DefaultInOutRule;
    list: DefaultInOutRule;
    def: LenientInOutRule;
    table: DefaultInOutRule;
    newline: TextInOutRule;
    paragraph: DefaultInOutRule;
    escape: DefaultInRule;
    autolink: DefaultInRule;
    mailto: DefaultInRule;
    url: DefaultInRule;
    link: DefaultInOutRule;
    image: DefaultInOutRule;
    reflink: DefaultInRule;
    refimage: DefaultInRule;
    em: DefaultInOutRule;
    strong: DefaultInOutRule;
    u: DefaultInOutRule;
    del: DefaultInOutRule;
    inlineCode: DefaultInOutRule;
    br: DefaultInOutRule;
    text: TextInOutRule;
  };

  type RefNode = {
    type: string;
    content?: ASTNode;
    target?: string;
    title?: string;
  };

  const defaultRules: DefaultRules;
  const sanitizeUrl: (url: string) => string | null;
  const blockRegex: (regex: RegExp) => MatchFunction;

  export function parserFor(): unknown;
  export function ruleOutput<T extends OutputRules<Rule>>(
    rules: T,
    property: keyof T
  ): unknown;
  export function reactFor(fn: ReactNodeOutput): ReactOutput;

  export { defaultRules, sanitizeUrl, blockRegex };
}

declare module '$:/plugins/noahlange/markdown-plus/emoji.json' {
  const dictionary: Record<string, string>;
  export default dictionary;
}
