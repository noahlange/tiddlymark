const { resolve } = require('path');

module.exports = [
  {
    target: 'web',
    entry: {
      'sass/parser': resolve(__dirname, `./src/parser.ts`)
    }
  },
  {
    target: 'node',
    entry: {
      'sass/hook': resolve(__dirname, './src/hook.ts')
    }
  }
];
