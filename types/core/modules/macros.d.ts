type MacroParam<T extends string = ''> = Record<T, { name: T }>;

declare module '$:/core/modules/macros/changecount.js' {
  export const name = 'changecount';
  export const params: MacroParam[];
  export function run(): string;
}

declare module '$:/core/modules/macros/contrastcolour.js' {
  export const name = 'contrastcolour';
  export const params: Array<MacroParam<
    'target' | 'fallbackTarget' | 'colourA' | 'colourB'
  >>;
  export function run(target: string, fallbackTarget: string): string;
}

declare module '$:/core/modules/macros/csvtiddlers.js' {
  export const name = 'csvtiddlers';
  export const params: Array<MacroParam<'filter'>>;
  export function run(filter: string): string;
}

declare module '$:/core/modules/macros/displayshortcuts.js' {
  export const name = 'displayshortcuts';
  export const params: Array<MacroParam<
    'shortcuts' | 'prefix' | 'separator' | 'suffix'
  >>;
  export function run(): string;
}

declare module '$:/core/modules/macros/jsontiddler.js' {
  export const name = 'jsontiddler';
  export const params: Array<MacroParam<'title'>>;
  export function run(title: string): string;
}

declare module '$:/core/modules/macros/jsontiddlers.js' {
  export const name = 'jsontiddlers';
  export const params: Array<MacroParam<'filter'>>;
  export function run(title: string): string;
}

declare module '$:/core/modules/macros/makedatauri.js' {
  export const name = 'makedatauri';
  export const params: Array<MacroParam<'text' | 'type'>>;
  export function run(text: string, type: string): string;
}

declare module '$:/core/modules/macros/now.js' {
  export const name = 'now';
  export const params: Array<MacroParam<'format'>>;
  export function run(format: string): string;
}
