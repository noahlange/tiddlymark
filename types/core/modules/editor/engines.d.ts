declare module '$:/core/modules/editor/engines/framed.js' {
  import type {
    EditTextEngine,
    EditTextEngineOptions,
    EditTextWidget,
    TextOperation
  } from '$:/core/modules/editor/factory.js';

  export class FramedEngine implements EditTextEngine {
    /*
      Copy styles from the dummy text area to the textarea in the iframe
    */
    public copyStyles(): void;
    /*
      Set the text of the engine if it doesn't currently have focus
    */
    public setText(text: string, type: string): void;
    /*
      Get the text of the engine.
    */
    public getText(): string;
    public fixHeight(): void;
    public focus(): void;
    public handleClickEvent(event: MouseEvent): boolean;
    public handleInputEvent(event: Event): boolean;

    public createTextOperation(): TextOperation;
    public executeTextOperation(operation: TextOperation): void;

    public widget: EditTextWidget;
    public value: string;
    public parentNode: HTMLElement;
    public nextSibling: HTMLElement;
    public domNode: HTMLElement;

    public constructor(options: EditTextEngineOptions);
  }
}

declare module '$:/core/modules/editor/engines/simple.js' {
  import type {
    EditTextEngine,
    EditTextEngineOptions,
    EditTextWidget,
    TextOperation
  } from '$:/core/modules/editor/factory.js';

  export class SimpleEngine implements EditTextEngine {
    public constructor(options: EditTextEngineOptions);
    public getText(): string;
    public fixHeight(): void;
    public focus(): void;
    public handleFocusEvent(event?: FocusEvent): boolean;
    public handleInputEvent(event: Event): boolean;

    public createTextOperation(): null;
    public executeTextOperation(operation: TextOperation): void;

    public widget: EditTextWidget;
    public value: string;
    public parentNode: HTMLElement;
    public nextSibling: HTMLElement;
    public domNode: HTMLElement;
  }
}
