declare module '$:/core/modules/saver-handler.js' {
  interface SaverHandlerOptions {
    wiki: TiddlyWiki;
    dirtyTracking: boolean;
    preloadDirty: boolean;
  }

  interface SaveWikiOptions {
    method: 'save' | 'autosave' | 'download';
    template: string;
    downloadType: string;
  }

  export class SaverHandler {
    public titleSyncFilter: string;
    public titleAutoSave: string;
    public titleSavedNotification: string;

    public initSavers(moduleType: ModuleType): void;
    public saveWiki(options: SaveWikiOptions): boolean;
    public isDirty(): boolean;
    public updateDirtyStatus(): void;

    public constructor(options: SaverHandlerOptions);
  }
}
