declare module 'sass.js/dist/sass.sync.js';

declare module '$:/plugins/noahlange/sass/sass.js' {
  export function compile(text: string): Promise<string>;
}
