module.exports = [
  {
    target: 'web',
    entry: {
      'monaco/engine': './plugins/monaco/src/engine.ts'
    }
  },
  {
    target: 'node',
    entry: {
      'monaco/entry': './plugins/monaco/src/entry.ts',
      'monaco/route': `./plugins/monaco/src/route.ts`
    }
  },
  {
    target: 'webworker',
    output: {
      libraryTarget: 'umd'
    },
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
