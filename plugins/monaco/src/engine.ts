/// <reference lib="dom" />

import * as monaco from 'monaco-editor';

import {
  EditTextWidget,
  EditTextEngine,
  EditTextEngineOptions
} from '$:/core/modules/editor/factory.js';

import { parseConfig, langFrom, workerFrom } from './utils';

window.MonacoEnvironment = {
  getWorkerUrl: (_: unknown, label: string) =>
    `/workers/noahlange/monaco/${workerFrom(label)}.worker.js`
};

export class MonacoEngine implements EditTextEngine {
  public widget: EditTextWidget;
  public parentNode: HTMLElement;
  public nextSibling: HTMLElement;
  public domNode!: HTMLDivElement;

  public get value(): string {
    return this.data.value;
  }

  protected data: { type: string; value: string };
  protected monaco!: monaco.editor.IStandaloneCodeEditor;
  protected config!: monaco.editor.IEditorOptions & {
    theme?: string;
    customTheme?: monaco.editor.IStandaloneThemeData;
  };

  constructor(options: EditTextEngineOptions) {
    const { widget, parentNode, nextSibling, ...tiddler } = options;
    this.widget = widget;
    this.parentNode = parentNode;
    this.nextSibling = nextSibling;
    this.data = tiddler;
    this.insertDOMNode();
    this.makeEditor();
  }

  public getText(): string {
    return this.monaco.getValue();
  }

  public setText(text: string, type: string): void {
    let m = this.monaco.getModel();
    const l = langFrom(type);
    if (m) {
      if (!this.monaco.hasWidgetFocus()) {
        monaco.editor.setModelLanguage(m, l);
        m.setValue(text);
      }
    } else {
      m = monaco.editor.createModel(text, l);
      this.monaco.setModel(m);
    }
    m.updateOptions({ tabSize: 2 });
  }

  public fixHeight(): void {
    this.monaco.layout();
  }

  public focus(): void {
    this.monaco.focus();
  }

  public createTextOperation(): null {
    return null;
  }

  public executeTextOperation(): void {
    return;
  }

  protected insertDOMNode(): void {
    this.domNode = document.createElement('div');
    this.domNode.style.minHeight = '600px';
    this.parentNode.insertBefore(this.domNode, this.nextSibling);
    this.widget.domNodes.push(this.domNode);
  }

  protected addListeners(): void {
    const model = this.monaco.getModel();
    if (model) {
      model.onDidChangeContent(() => {
        this.widget.saveChanges(this.getText());
      });
      this.monaco.onKeyDown(e => {
        this.widget.handleKeydownEvent(e.browserEvent);
      });
    }
  }

  protected async makeEditor(): Promise<void> {
    this.config = parseConfig('monaco', $tw.wiki);
    if (this.config.customTheme) {
      monaco.editor.defineTheme('custom', this.config.customTheme);
      this.config.theme = 'custom';
    }
    this.monaco = monaco.editor.create(this.domNode, this.config);
    this.setText(this.data.value, this.data.type);
    this.addListeners();
  }
}
