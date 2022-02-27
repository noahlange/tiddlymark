declare module '$:/core/modules/editor/factory.js' {
  import { widget as Widget } from '$:/core/modules/widgets/widget.js';

  interface EditTextEngineConstructor<
    T extends EditTextEngine = EditTextEngine
  > {
    new (): T;
  }

  export interface EditTextEngine {
    getText(): string;
    fixHeight(): void;
    createTextOperation(): TextOperation | null;
    executeTextOperation(operation: TextOperation): void;

    widget: Widget;
    value: string;
    parentNode: HTMLElement;
    nextSibling: HTMLElement;
    domNode: HTMLElement;
  }

  interface TextOperation {
    selection: string;
    text: string;
    selStart: number;
    selEnd: number;
    cutStart: number | null;
    cutEnd: number | null;
    replacement: number | null;
    newSelStart: number | null;
    newSelEnd: number | null;
  }

  interface EditInfo {
    update: (value: string) => void;
    type: string;
    value: string;
  }

  interface EditTextOperationEvent {
    param: string;
  }

  interface EditTextEngineOptions {
    widget: EditTextWidget;
    value: string;
    type: string;
    parentNode: HTMLElement;
    nextSibling: HTMLElement;
  }

  class EditTextWidget extends Widget<UnknownRecord> {
    /** Render this widget into the DOM */
    public render(parent: HTMLElement, nextSibling: HTMLElement): void;
    /** Get the tiddler being edited and current value */
    public getEditInfo(): EditInfo;
    /**
    Handle an edit text operation message from the toolbar
  */
    public handleEditTextOperationMessage(event: EditTextOperationEvent): void;
    /**
    Compute the internal state of the widget
  */
    public execute(): void;
    /**
    Selectively refreshes the widget if needed. Returns true
    if the widget or any of its children needed re-rendering
  */
    public refresh(changedTiddlers: unknown): boolean;
    /**
    Update the editor with new text. This method is separate from updateEditorDomNode()
    so that subclasses can override updateEditor() and still use updateEditorDomNode()
  */
    public updateEditor(text: string, type: string): void;
    /**
    Update the editor dom node with new text
  */
    public updateEditorDomNode(text: string, type: string): void;
    /**
    Save changes back to the tiddler store
  */
    public saveChanges(text: string): void;
    /**
    Handle a dom "keydown" event, which we'll bubble up to our container
    for the keyboard widgets benefit
  */
    public handleKeydownEvent(event: KeyboardEvent): boolean;
    /**
    Propogate keydown events to our container for the keyboard widgets benefit
  */
    public propogateKeydownEvent(event: KeyboardEvent): boolean;
  }

  export function editTextWidgetFactory<
    A extends EditTextEngine,
    B extends EditTextEngine
  >(
    toolbarEngine: EditTextEngineConstructor<A>,
    nonToolbarEngine: EditTextEngineConstructor<B>
  ): typeof EditTextWidget;
}
