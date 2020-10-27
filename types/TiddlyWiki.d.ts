type ModuleType = 'command' | 'saver';
type PluginType = '';

interface GenerateFilepathOptions {
  directory: string;
  pathFilters: string[];
  extension?: string;
  wiki?: Wiki;
}

interface ParsedTextReference {
  title: string;
  field?: string;
  index?: string;
}

interface TaskModule {
  platforms: string[];
}

interface FileInfo {
  type: string;
  hasMetaFile: boolean;
  filepath: string;
  extension?: string;
}

type TerminalColour =
  | 'black'
  | 'red'
  | 'green'
  | 'brown/orange'
  | 'blue'
  | 'purple'
  | 'cyan'
  | 'light gray';

interface WikiUtils {
  /**
   * Parse a text reference of one of these forms:
   * ```
   * title
   * !!field
   * title!!field
   * title##index
   * ```
   */
  parseTextReference(textRef: string): ParsedTextReference;

  /**
   * Given a TerminalColor, return the corresponding TTY string.
   */
  terminalColor(color: string): string;
  terminalColourLookup: Record<TerminalColour, string>;

  /**
   * display a message, in colour if in on a terminal
   */
  log(text: string, color: TerminalColour): void;
  /**
   * Display a warning; in colour if in a terminal.
   */
  warning(text: string): void;
  /**
   * Return the base-10 integer value represented by text, or a default value.
   */
  getInt<T extends unknown>(text: string, def: T): number | T;
  /**
   * Replace all instances of `search` within `text`.
   */
  replaceString(text: string, search: string | RegExp, replace: string): string;
  /**
   * Repeats a string the indicated number of times.
   */
  repeat(text: string, count: number): string;

  /**
   * Trim starting and trailing whitespace.
   */
  trim(text: string): string;

  /**
   * Capitalize the first letter of a string.
   */
  toSentenceCase(text?: string): string;

  /** Capitalize the first letter of each word in a string. */
  toTitleCase(text?: string): string;

  /**
   * Find the first linebreak preceding a given position, returning its character index (or 0, if no linebreaks are found).
   */
  findPrecedinglineBreak(text: string, position: number): number;

  /**
   * Find the first line break after a given position, returning its character index (or the index of the last character, if no linebreaks are found).
   */
  findFollowingLineBreak(text: string, position: number): number;

  /**
   * Return the number of enumerable string properties/methods in an object.
   */
  count(object?: Record<string, unknown>): number;

  /**
   * Determine if a field is a property of an object.
   */
  hop(object: Record<string, unknown>, field: string): boolean;

  /**
   * Determine if some item of an array is a property of the given object.
   */
  hopArray(object: Record<string, unknown>, array: string[]): boolean;

  /**
   * Remove one or more values from an array.
   */
  removeArrayEntries<T>(array: T, value: T | T[]): T[];

  /**
   * Determine if `objectA` shares any field names with `objectB`.
   */
  checkDependencies(
    objectA: Record<string, unknown>,
    objectB: Record<string, unknown>
  ): boolean;

  /**
   * Copy the values of all keys within the prototype chains of `src` to `object`.
   */
  extend<T>(object: T, ...src: Array<Record<string, unknown>>): T;

  /**
   * Recursively copy an object.
   */
  deepCopy<T>(object: T): T;

  /**
   * Recursively copy an object, copying all fields in the prototype chain of `properties`.
   */
  extendDeepCopy<T, V, K extends keyof V>(
    object: T,
    properties: Record<K, V[K]>
  ): T & V;

  /**
   * Recursively freeze the contents of an object.
   */
  deepFreeze<T>(object: T): T;

  slowInSlowOut(t: number): number;

  error(message: string): void;
  deleteEmptyDirs(path: string, callback: Callback<[]>): void;
  createDirectory(path: string): void;
  Logger: $AnyFixMe;
  generateTiddlerFilepath(
    title: string,
    options: GenerateFilepathOptions
  ): string;
}

interface WikiModules {
  types: Record<string, unknown>;
  titles: Record<string, unknown>;

  /**
   * Execute module `name` within sandbox, optionally relative to module `root`.
   */
  execute(name: string, root?: string): Record<string, unknown>;

  /**
   * Executes `callback` on the `title` and `exports` of each module of a specified `type`.
   */
  forEachModuleOfType(
    /**
     * Type of module to be iterated upon.
     */
    type: string,
    /**
     * Function to be called on each module.
     */
    callback: (title: string, exports: Record<string, unknown>) => void
  ): void;

  /**
   * Returns the titles of all modules of a given type and their exports.
   */
  getModulesByTypeAsHashmap(): Record<string, Record<string, unknown>>;

  /**
   * Attach to the target object the exports of all modules with a given type
   */
  applyMethods<T extends Record<string, unknown>>(type: string, target?: T): T;

  /**
   * For each module of a specified type, instantiate an object using the provided constructor.
   */
  createClassesFromModules<T>(
    moduleType: string,
    subType: string,
    baseClass: { new (): T }
  ): T[];
}

interface TiddlyWiki {
  crypto: {
    updateCryptoStateTiddler(): void;
  };
  safeMode: boolean;
  packageInfo: Record<string, unknown>;
  preloadTiddlers: boolean;
  passwordPrompt: $AnyFixMe;
  wiki: Wiki;
  Wiki: typeof Wiki;
  boot: {
    /**
     * Decrypts encrypted tiddlers and starts application.
     */
    boot(callback: Callback): void;

    wikiPath: string;
    bootPath: string;
    corePath: string;
    argv: string[];
    suppressBoot: boolean;
    remainingStartupModules: $AnyFixMe[];
    executedStartupModules: Record<number, TaskModule>;
    disabledStartupModules: TaskModule[];

    executeNextStartupTask(callback?: Callback): void;
    doesMatchTaskPlatform(taskModule: TaskModule): boolean;
    isStartupTaskEligible(taskModule: TaskModule): boolean;
    startup(options: { bootPath: string; callback: Callback }): void;

    extraPlugins: string[];
    files: Record<string, FileInfo>;
    wikiTiddlersPath: string;
    tasks: {
      readBrowserTiddlers: boolean;
    };
  };
  hooks: {
    names: Record<string, $FnFixMe[]>;
    /**
     * Add a function for the given event hook.
     */
    addHook(hook: string, callback: $FnFixMe): void;
    /**
     * Invoke all functions for a given event hook.
     */
    invokeHook(hook: string, ...args: $AnyFixMe[]): unknown;
  };
  modules: WikiModules;
  browser: boolean;
  config: {
    preferences: {
      jsonSpaces: number;
    };
    contentTypeInfo: Record<string, { extension: string; encoding: string }>;
  };
  Tiddler: typeof Tiddler;
  utils: WikiUtils;
}

declare let $tw: TiddlyWiki;
declare let exports: Record<string, unknown>;
