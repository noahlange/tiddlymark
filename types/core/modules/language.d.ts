declare module '$:/core/modules/language.js' {
  interface LanguageOptions {
    wiki: TiddlyWiki;
  }

  interface GetStringOptions {
    /**
     * Optional hashmap of variables to supply to the language
     */
    variables?: unknown;
  }

  export class Language {
    /**
     * Return a wikified translateable string. The title is automatically
     * automatically prefixed with "$:/language/"
     *
     * @param title - tiddler title;
     * @returns wikified translateable string
     */
    public getString(title: string, options?: GetStringOptions): string;

    /**
     * Returns a raw, unwikified translateable string. The title is
     * automatically prefixed with "$:/language/"
     *
     * @param title - tiddler title
     * @returns unwikified translateable string
     */
    public getRawString(title: string): string;

    /**
     * Create an instance of the language manager
     * @param options
     */
    public constructor(options: LanguageOptions);
  }
}
