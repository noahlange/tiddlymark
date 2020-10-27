interface TiddlerFilter {}

interface GetTiddlersOptions {
  sortField: string;
  excludeTag: string;
  includeSystem: boolean;
}

declare class Wiki {
  public static tiddlerDeserializerModules: Record<string, $FnFixMe>;
  public caches: Record<string, unknown>;
  public globalCache: Record<string, unknown>;
  public parsers: Record<string, { new (): Parser }>;

  public addIndexersToWiki(): void;
  public getTextReference(
    textRef: string,
    defaultText: string,
    currentTitle: string
  ): $AnyFixMe;
  public setTextReference(
    textRef: string,
    value: string,
    currentTitle: string
  ): void;

  /**
   * Erase the indicated field from a tiddler.
   */
  public setText(title: string, field: string): void;
  /**
   * Modify the indicated field of a tiddler.
   */
  public setText(
    title: string,
    field: string,
    value: $AnyFixMe,
    options?: { suppressTimestamp: boolean }
  ): void;
  public setText(
    title: string,
    field: string,
    index: string,
    value?: $AnyFixMe,
    options?: { suppressTimestamp: boolean }
  ): void;

  public deleteTextReference(textRef: string, currentTitle: string): void;

  public addEventListener(type: string, listener: Callback): void;
  public removeEventListener(type: string, listener: Callback): void;
  public dispatchEvent(type: string, ...args: unknown[]): void;

  public enqueueTiddlerEvent(title: string, isDeleted?: boolean): void;
  public getSizeOfTiddlerEventQueue(): number;
  public getChangeCount(title: string): number;
  public generateNewTitle(
    baseTitle: string,
    options?: { prefix: string }
  ): string;

  public isSystemTiddler(title: string): boolean;
  public isTemporaryTiddler(title: string): boolean;
  public isImageTiddler(title: string): boolean;
  public importTiddler(tiddler: Tiddler): boolean;

  public getCreationFields(): TiddlerCreationFields;
  public getModificationFields(): TiddlerModificationFields;

  public getTiddler<T = unknown>(title: string): Tiddler<T>;
  public getTiddlers(options: GetTiddlersOptions): string[];

  public countTiddlers(excludeTag: string): number;
  public makeTiddlerIterator(
    titles: string[]
  ): (tiddler: Tiddler, title: string) => void;
  public sortTiddlers(
    titles: string[],
    sortField: string,
    isDescending?: boolean,
    isCaseSensitive?: boolean,
    isNumeric?: boolean,
    isAlphaNumeric?: boolean
  ): string[];

  public forEachTiddler(
    options: GetTiddlersOptions,
    callback: (title: string, tiddler: Tiddler) => void
  ): void;
  public getTiddlerLinks(title: string): string[];
  public getMissingTitles(): Record<string, number>;
  public getOrphanTitles(): string[];
  public getTiddlersWithTag(tag: string): string[];
  public getTagMap(): Record<string, string[]>;
  public findListingsOfTiddler(title: string, field?: string): string[];
  public sortByList(titles: string[], list: string[]): string[];
  public getSubTiddler(title: string, subTitle: string): Tiddler | null;
  public getTiddlerAsJson(title: string): string;
  public getTiddlersAsJson(filter: TiddlerFilter): string;
  public getTiddlerDataCached<T = TiddlerFields, F = unknown>(
    titleOrTiddler: string | Tiddler<T>,
    fallback?: F
  ): T | F;

  public getTiddlerData<T = TiddlerFields>(title: string): T | undefined;
  public getTiddlerData<T = TiddlerFields, F = unknown>(
    title: string,
    fallback: F
  ): T | F;
  public getTiddlerData<T = TiddlerFields, F = unknown>(
    title: string,
    fallback?: F
  ): T | F | undefined;

  public extractTiddlerDataItem(
    title: string,
    index: unknown,
    value: string
  ): string;

  public setTiddlerData(
    title: string,
    data: unknown,
    fields?: Partial<TiddlerFields>
  ): void;

  public getTiddlerList(
    title: string,
    field?: string,
    index?: unknown
  ): string[];
  public getGlobalCache<T>(name: string, initializer: () => T): T;
  public clearGlobalCache(): void;
  public getCacheForTiddler<T>(
    title: string,
    name: string,
    initializer: () => T
  ): T;
  public clearCache(title: string): void;
  public initParsers(moduleType?: string): void;
  public parseText(
    type?: string,
    text?: string,
    options?: ParserOptions
  ): Parser | null;
  public parseTiddler(title: string, options?: ParserOptions): unknown;
  public parseTextReference(
    title: string,
    field: string,
    index: unknown,
    options: ParserOptions
  ): unknown;

  public getTiddlerText(title: string): string;

  public readPluginInfo(): void;
  public registerPluginTiddlers(name: string, paths?: string[]): void;
  public unpackPluginTiddlers(): void;
  public processSafeMode(): void;
  public defineTiddlerModules(): void;
  public defineShadowModules(): void;

  public addTiddler(tiddler: Tiddler): void;

  public filterTiddlers(filter: string): string[];
}
