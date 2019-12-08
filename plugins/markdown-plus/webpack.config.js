const { resolve } = require('path');

module.exports = [
  {
    target: 'web',
    entry: {
      'markdown-plus/parser': resolve(__dirname, `./src/parser.ts`)
    }
  }
];
