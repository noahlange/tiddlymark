declare module '$:/core/modules/keyboard.js' {
  interface KeyInfo {
    keyCode: number;
    shiftKey: boolean;
    altKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
  }

  interface ParseKeyDescriptionsOptions {
    stack: string[];
  }

  export class KeyboardManager {
    /**
      @returns keycodes for the modifier keys ctrl, shift, alt, meta
    */
    public getModifierKeys(): number[];
    public parseKeyDescriptor(descriptor: string): KeyInfo;
    public parseKeyDescriptors(
      descriptors: string | string[],
      options: unknown
    ): KeyInfo[];

    public getPrintableShortcuts(info: KeyInfo[]): string;
    public checkKeyDescriptor(event: KeyboardEvent, keyInfo: KeyInfo): boolean;
    public checkKeyDescriptors(
      event: KeyboardEvent,
      keyInfoArray: KeyInfo[]
    ): boolean;

    public getShortcutTiddlerList(): string[];
    public updateShortcutLists(list: string[]): void;
    public handleKeydownEvent(event: KeyboardEvent): boolean;
    public detectNewShortcuts(changedTiddlers: string[]): boolean;
    public handleShortcutChanges(changedTiddlers: string[]): void;
  }
}
