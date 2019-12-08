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
  }
];
