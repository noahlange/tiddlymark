declare module '$:/core/modules/utils/parseutils.js' {
  interface ParseUtilResult<T> {
    type: T;
    start: number;
    end: number;
  }

  type ParseAttributeResult =
    | ParseUtilResult<string>
    | {
        type: 'string';
        value: string;
      }
    | { type: 'filtered'; value: unknown }
    | { type: 'indirect'; textReference: unknown }
    | { type: 'macro'; value: unknown };

  export function parseWhiteSpace(
    source: string,
    pos: number
  ): ParseUtilResult<'whitespace'> | null;

  export function skipWhiteSpace(source: string, pos: number): number;

  export function parseTokenString(
    source: string,
    pos: number,
    token: string
  ): ParseUtilResult<'token'> | null;

  export function parseTokenRegExp(
    source: string,
    pos: number,
    reToken: RegExp
  ): ParseUtilResult<'regexp'> | null;

  export function parseStringLiteral(
    source: string,
    pos: number
  ): ParseUtilResult<'string'> | null;

  export function parseMacroParameter(
    source: string,
    pos: number
  ): ParseUtilResult<'macro-parameter'> | null;

  export function parseMacroInvocation(
    source: string,
    pos: number
  ): ParseUtilResult<'macrocall'> | null;

  export function parseAttribute(
    source: string,
    pos: number
  ): ParseAttributeResult | null;
}
