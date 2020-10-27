declare module '$:/core/modules/utils/edition-info.js' {
  export function getEditionInfo(): Record<string, unknown>;
}

declare module '$:/core/modules/utils/csv.js' {
  interface CSVParseOptions {
    separator: string;
  }

  export function parseCsvStringWithHeader<
    T extends Record<string, unknown> = Record<string, unknown>
  >(text: string, options: CSVParseOptions): T[];
}

declare module '$:/core/modules/utils/fakedom.js' {
  abstract class TW_Node {
    public parentNode?: TW_Node;
    public get nodeType(): number;
  }

  class TW_TextNode extends TW_Node {
    public textContent: string;
    public get formattedTextContent(): string;
    public constructor(text: string);
  }

  class TW_Element extends TW_Node {
    protected _style: string;

    public attributes: Record<string, string>;
    public isRaw: boolean;

    /**
     * Does nothing.
     */
    public addEventListener(
      type: string,
      listener: $FnFixMe,
      useCapture: unknown
    ): void;

    public getAttribute(name: string): string;
    public setAttribute(name: string, value: string): void;
    public setAttributeNS(namespace: string, name: string, value: string): void;
    public removeAttribute(name: string): void;
    public appendChild(node: TW_Node): void;
    public removeChild(node: TW_Node): void;
    public insertBefore(node: TW_Node, nextSibling: TW_Node): void;
    public hasChildNodes(): boolean;

    public get childNodes(): TW_Node[];
    public get firstChild(): TW_Node;

    public get value(): string;
    public set value(value: string);

    public get outerHTML(): string;
    public get innerHTML(): string;
    public set innerHTML(value: string);

    public set textInnerHTML(value: string);

    public set textContent(value: string);
    public get textContent(): string;

    public get formattedTextContent(): string;

    public get className(): string;
    public set className(value: string);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore; see implementation.
    public get style(): Record<string, unknown>;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore; " "
    public set style(value: string);

    public constructor(tag: string, namespace: string);
  }

  export const fakeDocument: {
    setSequenceNumber(value: number): void;
    createElementNS(namespace: string, tag: string): TW_Element;
    createElement(tag: string): TW_Element;
    createTextNode(text: string): TW_TextNode;
    compatMode: string;
    isTiddlyWikiFakeDom: boolean;
  };
}

declare module '$:/core/modules/utils/filesystem.js' {
  /**
   * Recursively copy a directory and content
   */
  export function copyDirectory(src: string, dest: string): Error | null;

  /**
   * Copy a file.
   */
  export function copyFile(src: string, dest: string): Error | null;

  /**
   * Remove the trailing separator from a file path.
   */
  export function removeTrailingSeparator(path: string): string;

  /**
   * Create a directory (including parents, if necessary).
   */
  export function createDirectory(dirPath: string): string | null;

  /**
   * Create a directory (including parents, if necessary) for a file path.
   */
  export function createFileDirectories(filePath: string): string | null;

  /**
   * Recursively delete a directory and its contents.
   */
  export function deleteDirectory(path: string): null;

  /**
   * Determine if a path corresponds to a directory.
   */
  export function isDirectory(path: string): boolean;

  /**
   * Recursively delete all directories within a specified directory.
   */
  export function deleteEmptyDirs(
    path: string,
    callback: (error: Error) => void
  ): void;

  export function generateTiddlerFileInfo(
    tiddler: Tiddler,
    options: GenerateFilepathOptions
  ): FileInfo;

  export function generateTiddlerFilepath(
    title: string,
    options: GenerateFilepathOptions
  ): FileInfo;
}
