const { resolve } = require('path');

module.exports = [
  {
    target: 'node',
    entry: {
      'fs-plus/adapter': resolve(__dirname, `./src/adapter.ts`)
    }
  }
];
