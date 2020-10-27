declare module '$:/core/modules/deserializers.js' {
  interface ExportType {
    'application/x-tiddler-html-div'(text: string, fields: string): unknown;
    'application/json'(text: string, fields: string[]): unknown;
    'text/html'(text: string, fields: string[]): unknown;
  }

  export = ExportType;
}
