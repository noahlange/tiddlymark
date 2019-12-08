interface WidgetNode {
  type: string;
  start?: number;
  value?: string | WidgetNode;
  attributes: Record<string, WidgetNode>;
  tag?: string;
  end?: number;
  isBlock?: boolean;
  children: WidgetNode[];
  parentWidget: WidgetNode;
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
  type Param = { name: string; value: string };

  type VariableInfo = {
    /** params substituted while resolving variable */
    params?: Param[];
    /** output text */
    text: string;
  };

  type GetVariableInfoOptions = {
    /** params to be substituted */
    params?: Param[];
    /** default value */
    defaultValue?: string;
  };

  export type BaseWidgetAttributes = {
    tiddler: string;
    field: keyof TiddlerFields;
    index: number;
    focus?: boolean | 'true' | 'yes';
    default: string;
    type: string;
  };

  class Widget<
    A = {},
    T = A & BaseWidgetAttributes,
    K extends keyof T = keyof T
  > {
    parseTreeNode: WidgetNode;
    parentWidget: Widget;
    wiki: Wiki;
    document: Document;
    attributes: object;
    children: Widget[];
    domNodes: HTMLElement[];
    eventListeners: object;

    widgetClasses?: Record<string, typeof Widget>;

    postRender?: () => void;

    makeChildWidgets(): void;
    initialise(parseTreeNode: WidgetNode, options: unknown): void;

    render(parent: HTMLElement, nextSibling: HTMLElement): void;
    execute(): void;

    renderChildren(parent: HTMLElement, nextSibling: HTMLElement): void;
    /**
     * Compute the current values of the attributes of the widget. Returns a
     * shashmap of the names of the attributes that have changed
     */
    computeAttributes(): T;

    hasAttribute(name: string): boolean;
    assignAttributes(domNode: HTMLElement, options: unknown): void;
    getAttribute<A extends keyof T>(name: A, fallback?: T[A]): T[A];
    findNextSiblingDomNode(start?: number): HTMLElement | null;
    removeChildDomNodes(): void;
    findFirstDomNode(): HTMLElement | null;
    nextSibling(): HTMLElement | null;
    previousSibling(): HTMLElement | null;

    /**
     * Get the "prevailing value" of a context variable.
     * @param name - variable name
     * @param options
     */
    getVariableInfo(
      name: string,
      options?: GetVariableInfoOptions
    ): VariableInfo;

    /**
     * Returns the `text` result of getVariableInfo().
     * @param name
     * @param options
     */
    getVariable(name: string, options?: GetVariableInfoOptions): string;
    setVariable(name: string, value: any, params?: Param[]): void;

    /**
     * Remove the widget from DOM and rebuild.
     */
    refreshSelf(): void;

    /**
     * Check for attribute changes, re-render if necessary.
     * @param changed - tiddlers to check against for changes
     * @returns Did the widget (or any of its children) need to be re-rendered?
     */
    refresh(changed: Record<string, Tiddler>): boolean;

    /**
     * Run "refresh" on all the widget's children.
     * @param changed Did the widget's children need to be re-rendered?
     */
    refreshChildren(changed: Record<string, Tiddler>): boolean;
    constructor(parseTreeNode: WidgetNode, options: WidgetOptions);
  }

  export { Widget as widget };
}
