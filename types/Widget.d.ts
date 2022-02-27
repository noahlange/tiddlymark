interface WidgetNode {
  type: string;
  start?: number;
  value?: string | WidgetNode;
  attributes: UnknownRecord;
  tag?: string;
  end?: number;
  isBlock?: boolean;
  children?: WidgetNode[];
  parentWidget?: WidgetNode;
}

interface WidgetOptions {
  wiki: Wiki;
  parentWidget?: HTMLElement;
  document?: Document;
}

declare module '$:/core/modules/widgets/widget.js' {
  /**
   * key-value pair for parameter substitution.
   */
  interface Param {
    name: string;
    value: string;
  }

  interface VariableInfo {
    /** params substituted while resolving variable */
    params?: Param[];
    /** output text */
    text: string;
  }

  interface GetVariableInfoOptions {
    /** params to be substituted */
    params?: Param[];
    /** default value */
    defaultValue?: string;
  }

  export interface BaseWidgetAttributes {
    tiddler: string;
    field: keyof TiddlerFields;
    index: number;
    focus?: boolean | 'true' | 'yes';
    default: string;
    type: string;
  }

  class Widget<A = UnknownRecord, T = A & BaseWidgetAttributes> {
    public parseTreeNode: WidgetNode;
    public parentWidget: Widget;
    public wiki: Wiki;
    public document: Document;
    public attributes: T;
    public children: Widget[];
    public domNodes: HTMLElement[];
    public eventListeners: UnknownRecord;

    public widgetClasses?: Record<string, typeof Widget>;

    public postRender?: () => void;

    public makeChildWidgets(parseTreeNodes?: WidgetNode[]): void;
    public initialise(parseTreeNode: WidgetNode, options: unknown): void;

    public render(parent: HTMLElement, nextSibling: HTMLElement): void;
    public execute(): void;

    public renderChildren(parent: HTMLElement, nextSibling: HTMLElement): void;

    /**
     * Compute the current values of the attributes of the widget. Returns a
     * shashmap of the names of the attributes that have changed
     */
    public computeAttributes(): T;

    public hasAttribute(name: string): boolean;
    public assignAttributes(domNode: HTMLElement, options: unknown): void;
    public getAttribute<A extends keyof T>(name: A, fallback?: T[A]): T[A];
    public findNextSiblingDomNode(start?: number): HTMLElement | null;
    public removeChildDomNodes(): void;
    public findFirstDomNode(): HTMLElement | null;
    public nextSibling(): HTMLElement | null;
    public previousSibling(): HTMLElement | null;

    /**
     * Get the "prevailing value" of a context variable.
     * @param name - variable name
     * @param options
     */
    public getVariableInfo(
      name: string,
      options?: GetVariableInfoOptions
    ): VariableInfo;

    /**
     * Returns the `text` result of getVariableInfo().
     * @param name
     * @param options
     */
    public getVariable(name: string, options?: GetVariableInfoOptions): string;
    public setVariable(name: string, value: unknown, params?: Param[]): void;

    /**
     * Remove the widget from DOM and rebuild.
     */
    public refreshSelf(): void;

    /**
     * Check for attribute changes, re-render if necessary.
     * @param changed - tiddlers to check against for changes
     * @returns Did the widget (or any of its children) need to be re-rendered?
     */
    public refresh(changed: Record<string, Tiddler>): boolean;

    /**
     * Run "refresh" on all the widget's children.
     * @param changed Did the widget's children need to be re-rendered?
     */
    public refreshChildren(changed: Record<string, Tiddler>): boolean;
    public constructor(parseTreeNode: WidgetNode, options: WidgetOptions);
  }

  export { Widget as widget };
}
