declare module '$:/core/modules/wiki-bulkops.js' {
  type RenameTiddlerOptions = RelinkTiddlerOptions;

  interface RelinkTiddlerOptions {
    dontRenameInTags: boolean;
    dontRenameInLists: boolean;
  }

  export function renameTiddler(
    fromTitle: string,
    toTitle: string,
    options: RenameTiddlerOptions
  ): void;

  export function relinkTiddler(
    fromTitle: string,
    toTitle: string,
    options: RelinkTiddlerOptions
  ): void;
}
