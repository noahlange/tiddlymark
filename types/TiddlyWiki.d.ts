type GenerateFilepathOptions = {
  directory: string;
  pathFilters: string[];
  extension?: string;
  wiki?: Wiki;
};

type TaskModule = {
  platforms: string[];
};

type FileInfo = {
  type: string;
  hasMetaFile: boolean;
  filepath: string;
  extension?: string;
};

type TiddlyWiki = {
  crypto: {
    updateCryptoStateTiddler(): void;
  };
  safeMode: boolean;
  packageInfo: object;
  preloadTiddlers: boolean;
  passwordPrompt: $AnyFixMe;
  wiki: Wiki;
  Wiki: typeof Wiki;
  boot: {
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
    boot(callback: Callback): void;

    extraPlugins: string[];
    files: Record<string, FileInfo>;
    wikiTiddlersPath: string;
    tasks: {
      readBrowserTiddlers: boolean;
    };
  };
  hooks: {
    names: object;
    addHook(hook: string, callback: $FnFixMe): void;
    invokeHook(hook: string, ...args: $AnyFixMe[]): unknown;
  };
  modules: {
    forEachModuleOfType(
      type: string,
      cb: (title: string, module: $AnyFixMe) => void
    ): void;
  };
  browser: boolean;
  config: {
    preferences: {
      jsonSpaces: number;
    };
    contentTypeInfo: Record<string, { extension: string; encoding: string }>;
  };
  Tiddler: typeof Tiddler;
  utils: {
    deleteEmptyDirs(path: string, callback: Callback<[]>): void;
    trim(input: string): string;
    createDirectory(path: string): void;
    Logger: $AnyFixMe;
    generateTiddlerFilepath(
      title: string,
      options: GenerateFilepathOptions
    ): string;
  };
};

declare var $tw: TiddlyWiki;
declare var exports: Record<string, any>;
