declare module '$:/plugins/noahlange/monaco/editor.js' {
  import { widget as Widget } from '$:/core/modules/widgets/widget.js';
  export class Monaco extends Widget {}
}
declare module '$:/plugins/noahlange/monaco/engine.js' {
  import { widget as Widget } from '$:/core/modules/widgets/widget.js';

  import {
    EditTextEngine,
    EditTextEngineOptions,
    TextOperation
  } from '$:/core/modules/editor/factory.js';

  export class MonacoEngine implements EditTextEngine {
    getText(): string;
    fixHeight(): void;
    focus(): void;

    createTextOperation(): null;
    executeTextOperation(): void;

    widget: Widget;
    value: string;
    parentNode: HTMLElement;
    nextSibling: HTMLElement;
    domNode: HTMLElement;

    constructor(options: EditTextEngineOptions);
  }
}

interface Window {
  MonacoEnvironment: {
    getWorkerUrl: (_: unknown, label: string) => string;
  };
}
