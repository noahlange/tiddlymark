type TiddlerFilter = {};

type GetTiddlersOptions = {
  sortField: string;
  excludeTag: string;
  includeSystem: boolean;
};

declare class Wiki {
  static tiddlerDeserializerModules: Record<string, $FnFixMe>;
  caches: Record<string, unknown>;
  globalCache: Record<string, unknown>;
  parsers: Record<string, { new (): Parser }>;

  addIndexersToWiki(): void;
  getTextReference(
    textRef: string,
    defaultText: string,
    currentTitle: string
  ): $AnyFixMe;
  setTextReference(textRef: string, value: string, currentTitle: string): void;
  /** Erase the indicated field from a tiddler. */
  setText(title: string, field: string): void;
  /** Modify the indicated field of a tiddler. */
  setText(
    title: string,
    field: string,
    value: $AnyFixMe,
    options?: { suppressTimestamp: boolean }
  ): void;
  setText(
    title: string,
    field: string,
    index: string,
    value?: $AnyFixMe,
    options?: { suppressTimestamp: boolean }
  ): void;
  deleteTextReference(textRef: string, currentTitle: string): void;

  addEventListener(type: string, listener: Callback): void;
  removeEventListener(type: string, listener: Callback): void;
  dispatchEvent(type: string, ...args: any[]): void;

  enqueueTiddlerEvent(title: string, isDeleted?: boolean): void;
  getSizeOfTiddlerEventQueue(): number;
  getChangeCount(title: string): number;
  generateNewTitle(baseTitle: string, options?: { prefix: string }): string;

  isSystemTiddler(title: string): boolean;
  isTemporaryTiddler(title: string): boolean;
  isImageTiddler(title: string): boolean;
  importTiddler(tiddler: Tiddler): boolean;

  getCreationFields(): TiddlerCreationFields;
  getModificationFields(): TiddlerModificationFields;

  getTiddler<T = {}>(title: string): Tiddler<T>;
  getTiddlers(options: GetTiddlersOptions): string[];

  countTiddlers(excludeTag: string): number;
  makeTiddlerIterator(
    titles: string[]
  ): (tiddler: Tiddler, title: string) => void;
  sortTiddlers(
    titles: string[],
    sortField: string,
    isDescending?: boolean,
    isCaseSensitive?: boolean,
    isNumeric?: boolean,
    isAlphaNumeric?: boolean
  ): string[];

  forEachTiddler(
    options: GetTiddlersOptions,
    callback: (title: string, tiddler: Tiddler) => void
  ): void;
  getTiddlerLinks(title: string): string[];
  getMissingTitles(): Record<string, number>;
  getOrphanTitles(): string[];
  getTiddlersWithTag(tag: string): string[];
  getTagMap(): Record<string, string[]>;
  findListingsOfTiddler(title: string, field?: string): string[];
  sortByList(titles: string[], list: string[]): string[];
  getSubTiddler(title: string, subTitle: string): Tiddler | null;
  getTiddlerAsJson(title: string): string;
  getTiddlersAsJson(filter: TiddlerFilter): string;
  getTiddlerDataCached<T = TiddlerFields, F = {}>(
    titleOrTiddler: string | Tiddler<T>,
    fallback?: F
  ): T | F;

  getTiddlerData<T = TiddlerFields>(title: string): T | undefined;
  getTiddlerData<T = TiddlerFields, F = {}>(title: string, fallback: F): T | F;
  getTiddlerData<T = TiddlerFields, F = {}>(
    title: string,
    fallback?: F
  ): T | F | undefined;

  extractTiddlerDataItem(title: string, index: unknown, value: string): string;

  setTiddlerData(
    title: string,
    data: object,
    fields?: Partial<TiddlerFields>
  ): void;

  getTiddlerList(title: string, field?: string, index?: unknown): string[];
  getGlobalCache<T>(name: string, initializer: () => T): T;
  clearGlobalCache(): void;
  getCacheForTiddler<T>(title: string, name: string, initializer: () => T): T;
  clearCache(title: string): void;
  initParsers(moduleType?: string): void;
  parseText(
    type?: string,
    text?: string,
    options?: ParserOptions
  ): Parser | null;
  parseTiddler(title: string, options?: ParserOptions): unknown;
  parseTextReference(
    title: string,
    field: string,
    index: unknown,
    options: ParserOptions
  ): unknown;

  getTiddlerText(title: string): string;

  readPluginInfo(): void;
  registerPluginTiddlers(name: string, paths?: string[]): void;
  unpackPluginTiddlers(): void;
  processSafeMode(): void;
  defineTiddlerModules(): void;
  defineShadowModules(): void;

  addTiddler(tiddler: Tiddler): void;

  filterTiddlers(filter: string): string[];
}
