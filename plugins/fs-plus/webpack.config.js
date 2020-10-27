const { resolve } = require('path');

module.exports = [
  {
    target: 'node',
    node: 'empty',
    entry: {
      'fs-plus/adapter': resolve(__dirname, `./src/index.ts`)
    }
  }
];
