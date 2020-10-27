declare module '$:/plugins/noahlange/monaco/editor.js' {
  import { widget as Widget } from '$:/core/modules/widgets/widget.js';
  export class Monaco extends Widget {}
}
declare module '$:/plugins/noahlange/monaco/engine.js' {
  import type { widget as Widget } from '$:/core/modules/widgets/widget.js';

  import type {
    EditTextEngine,
    EditTextEngineOptions
  } from '$:/core/modules/editor/factory.js';

  export class MonacoEngine implements EditTextEngine {
    public getText(): string;
    public fixHeight(): void;
    public focus(): void;

    public createTextOperation(): null;
    public executeTextOperation(): void;

    public widget: Widget;
    public value: string;
    public parentNode: HTMLElement;
    public nextSibling: HTMLElement;
    public domNode: HTMLElement;

    public constructor(options: EditTextEngineOptions);
  }
}

interface Window {
  MonacoEnvironment: {
    getWorkerUrl: (_: unknown, label: string) => string;
  };
}
