module.exports = [
  {
    target: 'webworker',
    entry: {
      'monaco/workers/editor.worker':
        'monaco-editor/esm/vs/editor/editor.worker.js',
      'monaco/workers/json.worker':
        'monaco-editor/esm/vs/language/json/json.worker',
      'monaco/workers/css.worker':
        'monaco-editor/esm/vs/language/css/css.worker',
      'monaco/workers/html.worker':
        'monaco-editor/esm/vs/language/html/html.worker',
      'monaco/workers/ts.worker':
        'monaco-editor/esm/vs/language/typescript/ts.worker'
    }
  }
];
